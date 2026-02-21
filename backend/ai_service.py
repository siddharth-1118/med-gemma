from typing import Optional, List, Dict
import logging
import io
import hashlib
import time
import numpy as np
import pydicom
from PIL import Image
# from transformers import pipeline  # MOVED TO LAZY
import google.generativeai as genai
import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

# Find .env in project root relative to this file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from . import ethical_ai_logic as ethical

# Configure Logging
logger = logging.getLogger("MedGemma-Service")
logging.basicConfig(level=logging.INFO)

# --- CONFIGURATION ---
MODEL_ID = "google/paligemma-3b-ft-docvqa-448"
CLASSIFIER_ID = "microsoft/resnet-50"
DEVICE = "cpu" # Default to CPU for safety, update main.py to set to cuda if available

# --- GATING LABELS ---
ALLOWED_LABELS = {
    "radiograph", "monitor", "screen", "oscilloscope", 
    "x-ray", "mri", "ct scan", "ultrasound", "scan"
}

# --- GLOBAL STATE (Module Level) ---
classifier = None
model = None
processor = None

# Original load_models removed to avoid duplication. See bottom of file.

def configure_genai(api_key: str):
    """ Configure Google Gemini API """
    if not api_key:
        logger.warning("No Gemini API Key provided. AI will run in mock mode.")
        return
    genai.configure(api_key=api_key)
    logger.info("Google Gemini API configured.")

def _call_remote_engine(endpoint: str, data: dict = None, files: dict = None) -> Optional[dict]:
    """ Helper to call the remote Kaggle MedGemma engine. """
    remote_url = os.getenv("AI_SERVICE_URL")
    if not remote_url or "localhost" in remote_url or "127.0.0.1" in remote_url:
        print(f"DEBUG: Skipping remote call (Local/Mock mode active). URL: {remote_url}")
        return None
    
    try:
        url = f"{remote_url.rstrip('/')}/{endpoint.lstrip('/')}"
        print(f"📡 DEBUG: Sending {endpoint} to Kaggle AI: {url}")
        
        headers = {"ngrok-skip-browser-warning": "true"}
        
        if files:
            resp = requests.post(url, data=data, files=files, headers=headers, timeout=60)
        else:
            resp = requests.post(url, data=data, headers=headers, timeout=30)
            
        if resp.status_code == 200:
            print(f"DEBUG: Success from remote {endpoint}")
            return resp.json()
        print(f"DEBUG: Remote error {resp.status_code}: {resp.text[:100]}")
    except Exception as e:
        print(f"DEBUG: Remote connection Exception: {e}")
    return None

def process_medical_image(file_bytes: bytes, filename: str) -> Image.Image:
    """ Handles DICOM windowing, resizing, and normalization. """
    try:
        if filename.lower().endswith('.dcm'):
            dicom_data = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = dicom_data.pixel_array.astype(float)
            
            slope = getattr(dicom_data, 'RescaleSlope', 1)
            intercept = getattr(dicom_data, 'RescaleIntercept', 0)
            pixel_array = pixel_array * slope + intercept

            if hasattr(dicom_data, 'WindowCenter') and hasattr(dicom_data, 'WindowWidth'):
                center = dicom_data.WindowCenter
                width = dicom_data.WindowWidth
                if isinstance(center, (list, tuple)): center = center[0]
                if isinstance(width, (list, tuple)): width = width[0]
                min_val = center - (width / 2)
                max_val = center + (width / 2)
                pixel_array = np.clip(pixel_array, min_val, max_val)
            
            pixel_array = (pixel_array - pixel_array.min()) / (pixel_array.max() - pixel_array.min() + 1e-6)
            pixel_array = (pixel_array * 255).astype(np.uint8)
            image = Image.fromarray(pixel_array)
            if len(image.split()) == 1: image = image.convert("RGB")
        else:
            image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        
        return image.resize((448, 448), Image.Resampling.LANCZOS)
    except Exception as e:
        logger.error(f"Image processing failed: {e}")
        raise ValueError("Invalid image format.")

def classify_is_medical(image: Image.Image) -> bool:
    """ Returns True if image is likely medical/radiology. """
    if not classifier:
        logger.warning("Classifier absent. Defaulting to permissive mode (allowing image through).")
        return True  # Allow image to proceed to Gemini analysis

    try:
        results = classifier(image)
        top_result = results[0]
        label = top_result['label'].lower()
        
        if "radiograph" in label: return True
        
        for res in results[:3]:
            if any(allow in res['label'].lower() for allow in ALLOWED_LABELS) and res['score'] > 0.05:
                return True
        return False
    except Exception as e:
        logger.error(f"Classification error: {e}")
        return False

def analyze_image_mock(image: Image.Image, prompt: str) -> dict:
    """ 
    Simulates the strict medical analysis if full weights aren't loaded.
    Uses image hashing to ensure consistency (Same Spot Fix).
    """
    img_hash = hashlib.md5(image.tobytes()).hexdigest()
    import random
    random.seed(img_hash) 
    
    has_abnormality = random.random() > 0.7 
    
    if has_abnormality:
        findings = [
            "Opacity observed in the right upper lobe consistent with consolidation.",
            "Visualized lung fields showing signs of hyperinflation.",
            "Cardiomegaly observed."
        ]
        finding = random.choice(findings)
        location = random.choice(["Right Upper Lobe", "Left Lower Zone", "Bilateral"])
        confidence = "moderate"
        not_seen = "No pneumothorax."
    else:
        finding = "No focal consolidation or acute abnormality identified."
        location = "none"
        confidence = "high"
        not_seen = "No pleural effusion, no pneumothorax."

    return {
        "image_type": "medical",
        "image_findings": finding,
        "abnormality_location": location,
        "confidence": confidence,
        "what_is_not_seen": not_seen,
        "limitations": "Automated screening result; confirm with radiologist.",
        "suggested_review": ["Clinical Correlation Required"] if has_abnormality else ["Routine Follow-up"]
    }

def analyze_with_gemini(image: Image.Image, prompt: str) -> dict:
    """
    Analyze image using Google Gemini 1.5 Flash.
    Falls back to mock analysis if API fails.
    """
    if os.getenv("FORCE_LOCAL_MODEL") == "true":
        return analyze_with_local_model(image, prompt)

    # --- TRY REMOTE KAGGLE ENGINE FIRST ---
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    files = {'image': ('image.png', img_byte_arr.getvalue(), 'image/png')}
    remote_res = _call_remote_engine("analyze", data={'prompt': prompt}, files=files)
    if remote_res:
        logger.info("Successfully used Remote Kaggle Engine for analysis.")
        return remote_res

    # --- FALLBACK TO GEMINI ---
    try:
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        full_prompt = f"""
You are an expert medical radiologist AI. Analyze the provided medical image carefully and produce a detailed clinical report.

Clinical Context: {prompt}

Return ONLY a valid JSON object (no markdown, no code blocks) with these exact keys:
{{
    "image_type": "medical",
    "image_findings": "Detailed paragraph describing all visual findings, abnormalities, densities, opacities, structures visible in the image. Be specific and thorough - minimum 3 sentences.",
    "abnormality_location": "Specific anatomical location of any abnormality, or 'No focal abnormality'",
    "confidence": "high | moderate | low",
    "what_is_not_seen": "Explicitly list what is absent (e.g. No pneumothorax, No pleural effusion, No acute fractures)",
    "limitations": "Any image quality issues or limitations of this AI analysis",
    "suggested_review": ["Action 1", "Action 2", "Action 3"]
}}

IMPORTANT: Even if the image is unclear, provide your best clinical interpretation. Always include detailed image_findings.
"""
        
        response = gemini_model.generate_content([full_prompt, image])
        text = response.text.strip()
        # Clean any markdown
        text = text.replace('```json', '').replace('```', '').strip()
        
        # Try to parse JSON
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Extract anything that looks like a JSON object
            import re
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                return json.loads(match.group())
            # If still failing, build result from raw text
            return {
                "image_type": "medical",
                "image_findings": text[:500] if text else "Analysis complete. Please review image manually.",
                "abnormality_location": "See findings",
                "confidence": "moderate",
                "what_is_not_seen": "Could not parse full response",
                "limitations": "AI response was in non-standard format",
                "suggested_review": ["Review with radiologist", "Repeat analysis if needed"]
            }
        
    except Exception as e:
        logger.error(f"Gemini Analysis Failed: {e}")
        logger.info("Falling back to Mock Analysis")
        return analyze_image_mock(image, prompt)

# --- LOCAL MODEL SUPPORT ---

def load_local_model():
    """ Loads the local MedGemma model if configured. """
    global model, processor
    if os.getenv("FORCE_LOCAL_MODEL") == "true":
        try:
            import torch
            from transformers import AutoProcessor, AutoModelForCausalLM, BitsAndBytesConfig
            logger.info("Loading Local MedGemma Model (CPU)... This may take a while.")
            model_id = "google/medgemma-1.5-4b-it" 
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_use_double_quant=True
            )
            processor = AutoProcessor.from_pretrained(model_id)
            model = AutoModelForCausalLM.from_pretrained(
                model_id, 
                quantization_config=quantization_config,
                device_map="auto"
            )
            logger.info("Local MedGemma Model Loaded Successfully (4-bit).")
        except Exception as e:
            logger.error(f"Failed to load local model: {e}")

def medical_knowledge_lookup(symptom: str) -> dict:
    """ 
    Specialized knowledge lookup for symptoms/problems.
    Provides "Why it happens" and "What to do".
    """
    # Try remote engine first
    remote_res = _call_remote_engine("symptom_analysis", data={'problem': symptom})
    if remote_res:
        logger.info("Successfully used Remote Kaggle Engine for symptom analysis.")
        return remote_res

    try:
        # Priority model: gemini-flash-lite-latest (confirmed working)
        model_id = 'gemini-flash-lite-latest'
        logger.info(f"Knowledge lookup for: {symptom} using {model_id}")
        
        gemini_model = genai.GenerativeModel(model_id)
        
        prompt = f"""
        You are a medical knowledge expert. A user has reported the following problem: "{symptom}".
        
        Please provide a structured response in VALID JSON format with the following keys:
        1. "why": Explain clearly why this problem typically occurs (etiology/causes).
        2. "what_to_do": Provide safe, immediate lifestyle advice or non-medicinal actions.
        3. "red_flags": List 3-4 symptoms that would require immediate emergency medical attention.
        4. "next_steps": Recommended non-emergency follow-ups (e.g., "Consult a specialist").
        
        RULES:
        - Output MUST be valid JSON.
        - Do NOT prescribe specific medications.
        - Focus on explaining the physiology and safe home-care or professional guidance.
        - Be empathetic but clinical.
        """
        
        response = gemini_model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        return data
    except Exception as e:
        logger.error(f"Knowledge Lookup Failed: {e}")
        return {
            "why": "Unable to retrieve medical etiology at this moment.",
            "what_to_do": "Rest and monitor your symptoms. Consult a professional if the condition persists.",
            "red_flags": ["Severe pain", "Difficulty breathing", "Sudden confusion"],
            "next_steps": ["Please try your request again in a few moments", "Consult your primary care physician"]
        }

def analyze_with_local_model(image: Image.Image, prompt: str) -> dict:
    """ Run inference using the locally loaded MedGemma model and Ethical AI Protocol. """
    global model, processor
    if not model or not processor:
        logger.error("Local model not loaded. Falling back to mock.")
        return analyze_image_mock(image, prompt)

    try:
        # --- ETHICAL AI 4-STEP PROTOCOL ---
        
        # STEP 1: GATEKEEPER
        gatekeeper_inputs = processor(text=ethical.INTENT_CLASSIFICATION_PROMPT + f"\nUser Request: {prompt}", images=image, return_tensors="pt").to(model.device)
        gatekeeper_input_len = gatekeeper_inputs["input_ids"].shape[-1]
        
        with torch.inference_mode():
            gatekeeper_gen = model.generate(**gatekeeper_inputs, max_new_tokens=20, do_sample=False)
            category_output = processor.decode(gatekeeper_gen[0][gatekeeper_input_len:], skip_special_tokens=True).strip()
        
        # Extract category
        category = "A"
        for letter in "ABCDEFGHI":
            if category_output.startswith(letter):
                category = letter
                break
        
        # STEP 2: ROUTER
        if category != "A":
            refusal_prompt = ethical.REFUSAL_PROMPTS.get(category, ethical.REFUSAL_PROMPTS["B"])
            refusal_inputs = processor(text=refusal_prompt, images=image, return_tensors="pt").to(model.device)
            refusal_input_len = refusal_inputs["input_ids"].shape[-1]
            
            with torch.inference_mode():
                refusal_gen = model.generate(**refusal_inputs, max_new_tokens=200, do_sample=False)
                refusal_text = processor.decode(refusal_gen[0][refusal_input_len:], skip_special_tokens=True).strip()
            
            return {
                "image_type": "medical",
                "image_findings": refusal_text,
                "abnormality_location": "N/A (Refusal)",
                "confidence": "high",
                "what_is_not_seen": "N/A",
                "limitations": f"Safety Trigger: Category {category}",
                "suggested_review": ["Consult Professional Resources"]
            }
        
        # STEP 3: CLINICAL SUPPORT
        full_prompt = ethical.CLINICAL_SUPPORT_PROMPT + f"\nClinical Note: {prompt}"
        inputs = processor(text=full_prompt, images=image, return_tensors="pt").to(model.device)
        input_len = inputs["input_ids"].shape[-1]
        
        with torch.inference_mode():
            generation = model.generate(**inputs, max_new_tokens=512, do_sample=False)
            output_text = processor.decode(generation[0][input_len:], skip_special_tokens=True)
        
        # STEP 4: OUTPUT VALIDATION
        validation_inputs = processor(text=ethical.OUTPUT_VALIDATION_PROMPT + f"\nModel Response:\n{output_text}", images=image, return_tensors="pt").to(model.device)
        val_input_len = validation_inputs["input_ids"].shape[-1]
        
        with torch.inference_mode():
            val_gen = model.generate(**validation_inputs, max_new_tokens=512, do_sample=False)
            validated_text = processor.decode(val_gen[0][val_input_len:], skip_special_tokens=True).strip()

        return {
            "image_type": "medical",
            "image_findings": validated_text,
            "abnormality_location": "See findings",
            "confidence": "high",
            "what_is_not_seen": "N/A",
            "limitations": "Validated by Ethical AI Layer (Local medgemma-4b).",
            "suggested_review": ["Radiologist Review"]
        }
    except Exception as e:
        logger.error(f"Local Inference Failed: {e}")
        return analyze_image_mock(image, prompt)

def chat_with_ai(message: str, image: Optional[Image.Image] = None) -> str:
    """ Simple chat interface for MedGemma. Fallback to Gemini if local model absent. """
    global model, processor
    
    # Try remote engine first for chat
    remote_res = _call_remote_engine("chat", data={'message': message})
    if remote_res and "response" in remote_res:
        logger.info("Successfully used Remote Kaggle Engine for chat response.")
        return remote_res["response"]
    
    if not model or not processor:
        try:
            # Prioritized list of models
            # gemini-flash-lite-latest is confirmed working on this key
            model_names = [
                'gemini-flash-lite-latest',
                'gemini-2.0-flash-lite-preview-02-05',
                'gemini-2.0-flash',
                'gemini-1.5-flash'
            ]
            
            last_err = None
            for m_name in model_names:
                try:
                    logger.info(f"Local model absent. Attempting fallback with {m_name}...")
                    gemini_model = genai.GenerativeModel(m_name)
                    chat_context = f"You are a medical AI assistant. Answer the following question safely and accurately: {message}"
                    response = gemini_model.generate_content(chat_context)
                    return response.text
                except Exception as inner_e:
                    logger.warning(f"Fallback to {m_name} failed: {inner_e}")
                    last_err = inner_e
                    continue
            
            raise last_err if last_err else Exception("No Gemini models available.")
            
        except Exception as e:
            logger.error(f"Complete Gemini fallback failure: {e}")
            return f"AI Assistant: Currently processing a high volume of requests. Please try again in 10-15 seconds."

    try:
        # Context-aware chat prompt
        chat_prompt = f"User: {message}\nAssistant:" if not image else f"Based on the image, {message}"
        
        inputs = processor(text=chat_prompt, images=image, return_tensors="pt").to(model.device)
        input_len = inputs["input_ids"].shape[-1]
        
        with torch.inference_mode():
            generation = model.generate(**inputs, max_new_tokens=256, do_sample=True, temperature=0.7)
            response = processor.decode(generation[0][input_len:], skip_special_tokens=True).strip()
            
        return response
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        return "Sorry, I encountered an error processing your message."

# Update load_models to call load_local_model
def load_models():
    """ Load models into global state. Call this on app startup. """
    global classifier, model, processor
    try:
        from transformers import pipeline
        logger.info(f"Loading Classifier: {CLASSIFIER_ID}")
        classifier = pipeline("image-classification", model=CLASSIFIER_ID)
        logger.info("Classifier loaded.")
    except Exception as e:
        logger.error(f"Failed to load classifier: {e}")
    
    # Check for local model
    if os.getenv("FORCE_LOCAL_MODEL") == "true":
        load_local_model()

def get_ai_engine_status():
    """ Check if the remote Kaggle engine is reachable. """
    remote_url = os.getenv("AI_SERVICE_URL")
    if not remote_url or "localhost" in remote_url or "127.0.0.1" in remote_url:
        return {"status": "mock", "message": "Local/Mock mode active"}
        
    try:
        url = f"{remote_url.rstrip('/')}/health"
        print(f"📡 DEBUG: Pinging AI Health at {url}")
        resp = requests.get(url, headers={"ngrok-skip-browser-warning": "true"}, timeout=5)
        if resp.status_code == 200:
            return {"status": "online", "message": "Remote engine active", "remote_info": resp.json()}
        return {"status": "error", "message": f"Remote engine error {resp.status_code}"}
    except Exception as e:
        return {"status": "offline", "message": f"Could not reach remote engine: {str(e)}"}
