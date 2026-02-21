
# ============================================================
# MedGemma Kaggle AI Engine - FastAPI Server (FINAL VERSION)
# ============================================================
# INSTRUCTIONS:
# 1. Create a Kaggle Notebook with GPU T4 x2
# 2. Set these Kaggle Secrets:
#    - HF_TOKEN        : HuggingFace token (must have medgemma access)
#    - NGROK_AUTH_TOKEN: ngrok auth token (free at ngrok.com)
#    - GEMINI_API_KEY  : Google Gemini API key
# 3. Paste this entire script into a cell and run it
# 4. Copy the printed VITE_AI_SERVICE_URL into your .env file
# ============================================================

import os, sys, json, io, subprocess, asyncio

# --- INSTALL ---
subprocess.run([sys.executable, "-m", "pip", "install", "-q",
    "fastapi", "uvicorn", "python-multipart", "pyngrok", "nest_asyncio",
    "transformers", "accelerate", "bitsandbytes",
    "google-generativeai", "pillow"
])

import torch, re
from PIL import Image
import google.generativeai as genai
import nest_asyncio
nest_asyncio.apply()
from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig
from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pyngrok import ngrok, conf

# Confirmed working Gemini models for this API key
# gemini-flash-lite-latest = confirmed working for this API key
# gemini-2.0-flash* = 429 rate limited (works when quota resets)
# gemini-1.5-* = 404 not available in this API version
GEMINI_MODELS = [
    "gemini-flash-lite-latest",           # ✅ confirmed working
    "gemini-2.0-flash-lite",              # fallback when quota resets
    "gemini-2.0-flash",                   # fallback
    "gemini-2.0-flash-001",               # fallback
    "gemini-2.0-flash-lite-001",          # fallback
    "gemini-2.0-flash-lite-preview-02-05",# fallback
]
WORKING_GEMINI_MODEL = None  # set after startup detection

def detect_gemini_model():
    global WORKING_GEMINI_MODEL
    if not GEMINI_API_KEY:
        print("⚠️ No GEMINI_API_KEY — chat/symptom analysis unavailable")
        return
    print("\n🔍 Auto-detecting working Gemini model...")
    for m in GEMINI_MODELS:
        try:
            gm = genai.GenerativeModel(m)
            resp = gm.generate_content("Say OK")
            if resp and resp.text:
                WORKING_GEMINI_MODEL = m
                print(f"✅ Gemini model confirmed: {m}")
                return
        except Exception as e:
            print(f"   ✗ {m}: {str(e)[:60]}")
    print("❌ No working Gemini model found. Check GEMINI_API_KEY in Kaggle Secrets.")

# --- AUTH ---
HF_TOKEN = NGROK_TOKEN = GEMINI_API_KEY = None
try:
    from kaggle_secrets import UserSecretsClient
    secrets = UserSecretsClient()
    HF_TOKEN = secrets.get_secret("HF_TOKEN")
    NGROK_TOKEN = secrets.get_secret("NGROK_AUTH_TOKEN")
    GEMINI_API_KEY = secrets.get_secret("GEMINI_API_KEY")
    print("✅ All secrets loaded.")
except Exception as e:
    print(f"⚠️ Secrets error: {e}")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("✅ Gemini configured.")
    detect_gemini_model()  # find working model at startup

# --- MODEL ---
MODEL_ID = "google/medgemma-1.5-4b-it"
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔧 Device: {device}")

model = processor = None

if HF_TOKEN:
    from huggingface_hub import login
    try:
        login(token=HF_TOKEN)
        print(f"📦 Loading {MODEL_ID}...")
        quant = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype=torch.bfloat16)
        processor = AutoProcessor.from_pretrained(MODEL_ID, token=HF_TOKEN)
        model = AutoModelForImageTextToText.from_pretrained(
            MODEL_ID, quantization_config=quant, device_map="auto", token=HF_TOKEN
        )
        model.eval()
        print("✅ MedGemma-1.5-4b-it loaded (4-bit)!")
    except Exception as e:
        print(f"❌ Model load failed: {e} → using Gemini fallback")
else:
    print("⚠️ No HF_TOKEN → Gemini fallback only")

# --- APP ---
app = FastAPI(title="MedGemma AI Engine")

@app.get("/")
def root():
    return {"service": "MedGemma Kaggle AI Engine", "status": "online",
            "model": MODEL_ID if model else "Gemini Fallback", "device": device,
            "endpoints": ["/analyze", "/symptom_analysis", "/ws/chat", "/health"]}

@app.get("/health")
def health():
    return {"status": "healthy", "model": MODEL_ID if model else "Gemini Fallback", "device": device}

def _local_inference(image: Image.Image, prompt: str) -> dict:
    image = image.convert("RGB")
    
    # Tightened Medical Prompt for PaliGemma-based MedGemma
    # We use a more direct instruction set to avoid refusals
    structured_prompt = f"""medical analysis: {prompt}
Output format: JSON with image_findings (3+ detailed sentences), image_type (medical/non-medical), confidence, abnormalities (list), follow_up.
Findings must be specific to this scan."""

    messages = [{"role": "user", "content": [
        {"type": "image", "image": image},
        {"type": "text", "text": structured_prompt}
    ]}]
    
    inputs = processor.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=True,
        return_dict=True, return_tensors="pt"
    ).to(model.device, dtype=torch.bfloat16)
    
    input_len = inputs["input_ids"].shape[-1]
    
    with torch.inference_mode():
        out = model.generate(
            **inputs,
            max_new_tokens=300,        # Tighter limit to prevent rambling
            do_sample=True,
            temperature=0.05,          # Very low for clinical precision
            repetition_penalty=1.5,    # High penalty to stop the "honesty/camaraderie" loops
            top_p=0.9,
        )
    decoded = processor.decode(out[0][input_len:], skip_special_tokens=True).strip()
    print(f"[MedGemma raw output]: {decoded[:500]}...")

    def deduplicate_sentences(text):
        if not text or not isinstance(text, str): return text
        raw_sentences = [s.strip() for s in text.split(".") if s.strip()]
        unique_sentences = []
        for s in raw_sentences:
            words = set(s.lower().split())
            if not words: continue
            is_dupe = False
            for existing in unique_sentences:
                existing_words = set(existing.lower().split())
                intersection = words.intersection(existing_words)
                if len(intersection) / max(len(words), 1) > 0.7:
                    is_dupe = True
                    break
            if not is_dupe:
                unique_sentences.append(s)
        return ". ".join(unique_sentences[:8]) + "."

    # Robust JSON extraction
    result = None
    try:
        json_match = re.search(r'\{.*\}', decoded, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
    except:
        # Partial JSON handle: try to extract just the image_findings value if JSON is cut off
        findings_match = re.search(r'"image_findings":\s*"([^"]*)', decoded)
        if findings_match:
            result = {"image_findings": findings_match.group(1)}
    
    if result:
        if "image_findings" in result:
            result["image_findings"] = deduplicate_sentences(result["image_findings"])
        
        result.setdefault("image_type", "medical")
        result.setdefault("limitations", "AI analysis — verify with a licensed radiologist.")
        result.setdefault("what_is_not_seen", "See findings above.")
        result.setdefault("attention_regions", [])
        return result

    # Last resort fallback: strip JSON-like keys from raw text
    clean_text = re.sub(r'\{?\s*"image_type":\s*"[^"]*",?', '', decoded)
    clean_text = re.sub(r'"image_findings":\s*"', '', clean_text)
    clean_text = clean_text.replace('"', '').replace('{', '').replace('}', '').strip()
    
    return {"image_type": "medical", "image_findings": deduplicate_sentences(clean_text),
            "confidence": "moderate",
            "limitations": "AI-generated via MedGemma-1.5-4b-it. Must be verified by a licensed radiologist.",
            "what_is_not_seen": "Unable to extract structured negatives.",
            "uncertainties": "Clinical correlation recommended.",
            "followUps": ["Verify with radiologist", "Correlate with symptoms"],
            "attention_regions": []}

def _gemini_inference(image: Image.Image, prompt: str) -> dict:
    for m in GEMINI_MODELS:
        try:
            gm = genai.GenerativeModel(m)
            p = f"""You are a medical radiologist AI. Analyze this image.
Clinical context: {prompt}

IMPORTANT: First determine if this is a medical image (X-ray, MRI, CT scan, ultrasound, medical photograph).
Return ONLY valid JSON (no markdown) with these exact keys:
- image_type: "medical" if this is a medical scan/image, OR "non-medical" if it is not
- image_findings: if medical: detailed paragraph of specific findings (min 3 sentences). If non-medical: "This image does not appear to be a medical scan."
- confidence: high/moderate/low
- limitations: limitations of this AI analysis (e.g. image quality issues, AI-only assessment, needs radiologist review)
- what_is_not_seen: explicitly list what is absent (e.g. No pneumothorax, No pleural effusion, No acute fractures)
- uncertainties: what parts are unclear or uncertain
- followUps: list of 3 recommended clinical actions
- attention_regions: list of up to 5 objects, each with:
    - label: short name of the finding (e.g. "Consolidation", "Fracture", "Effusion", "Mass")
    - finding: one sentence description of what is found here
    - quadrant: MUST be exactly one of: "top-left", "top-right", "top-center", "center", "bottom-left", "bottom-right", "bottom-center", "left", "right"
    - severity: exactly one of: "normal", "mild", "moderate", "severe"

If the image is NOT a medical scan, set image_type to "non-medical" and set attention_regions to []."""
            resp = gm.generate_content([p, image])
            text = resp.text.strip().replace("```json","").replace("```","").strip()
            try: return json.loads(text)
            except:
                m2 = re.search(r'\{.*\}', text, re.DOTALL)
                if m2: return json.loads(m2.group())
        except Exception as e:
            print(f"{m} failed: {e}")
    return {"image_findings": "Analysis unavailable. Check Gemini API key.", "confidence": "low",
            "uncertainties": "API error", "followUps": ["Check Kaggle Secrets"]}

@app.middleware("http")
async def log_requests(request, call_next):
    from datetime import datetime
    now = datetime.now().strftime("%H:%M:%S")
    # Log incoming requests (except heartbeat to avoid spam)
    if request.url.path not in ["/test", "/health", "/"]:
        print(f"📥 [{now}] {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"❌ [{now}] Error: {str(e)}")
        raise

# CORS MUST BE ADDED LAST TO BE OUTERMOST (Handles OPTIONS first)
# allow_credentials=True is incompatible with origins="*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Authorization", "ngrok-skip-browser-warning"]
)

@app.get("/test")
def test_connection():
    return {"status": "ok", "message": "MedGemma AI Engine is reachable!"}

@app.post("/analyze")
async def analyze(image: UploadFile = File(...), prompt: str = Form("")):
    try:
        content = await image.read()
        print(f"📸 Image received: {len(content)} bytes")
        pil = Image.open(io.BytesIO(content))
        if not prompt: prompt = "Describe the medical findings in this image."
        result = _local_inference(pil, prompt) if (model and processor) else _gemini_inference(pil, prompt)
        return result
    except Exception as e:
        print(f"❌ Analysis Error: {str(e)}")
        return {"error": str(e), "image_findings": "Analysis failed on Kaggle engine."}

@app.post("/symptom_analysis")
async def symptom_analysis(problem: str = Form(...)):
    models_to_try = ([WORKING_GEMINI_MODEL] if WORKING_GEMINI_MODEL else []) + GEMINI_MODELS
    for m in dict.fromkeys(models_to_try):
        try:
            gm = genai.GenerativeModel(m)
            p = f"""Medical AI. Patient says: "{problem}"
Return ONLY valid JSON with keys:
- why: detailed medical explanation (2-3 paragraphs)
- what_to_do: numbered list of actionable steps
- red_flags: list of emergency warning signs"""
            resp = gm.generate_content(p)
            text = resp.text.strip().replace("```json","").replace("```","").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Symptom {m} failed: {e}")
    return {"why": "Unable to analyze.", "what_to_do": ["See a doctor"], "red_flags": ["Difficulty breathing", "Chest pain"]}

def _chat_response(message: str) -> str:
    models_to_try = ([WORKING_GEMINI_MODEL] if WORKING_GEMINI_MODEL else []) + GEMINI_MODELS
    for m in dict.fromkeys(models_to_try):
        try:
            print(f"[Chat] Trying {m}...")
            gm = genai.GenerativeModel(m)
            result = gm.generate_content(
                f"You are MedGemma, a helpful medical AI assistant. Answer the following question clearly and helpfully: {message}"
            ).text
            print(f"[Chat] ✅ {m} responded successfully.")
            return result
        except Exception as e:
            print(f"[Chat] ❌ {m} failed: {e}")
            continue
    return "I'm having trouble connecting to the AI. Please check the Kaggle Gemini API key."

@app.post("/chat")
async def chat_endpoint(message: str = Form(...)):
    return {"response": _chat_response(message)}

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("AI Assistant: Hello! I'm MedGemma (Kaggle GPU). How can I help?")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Patient: {data}")
            resp = await asyncio.get_event_loop().run_in_executor(None, _chat_response, data)
            await websocket.send_text(f"AI Assistant: {resp}")
    except WebSocketDisconnect:
        pass

# --- START ---
PORT = 8000
print("\n" + "="*60)
print("🚀 Starting MedGemma Kaggle AI Engine...")
print("="*60)

if NGROK_TOKEN:
    conf.get_default().auth_token = NGROK_TOKEN
    tunnel = ngrok.connect(PORT, "http")
    url = tunnel.public_url
    print(f"\n✅ Ngrok Active! Paste this into .env:\n")
    print(f"   VITE_AI_SERVICE_URL={url}\n")
    print("👉 Then restart: npm run dev")
    print("="*60 + "\n")

# Increase timeouts for large medical images
config = uvicorn.Config(
    app, 
    host="0.0.0.0", 
    port=PORT, 
    log_level="info",
    timeout_keep_alive=65,
    timeout_graceful_shutdown=60
)
server = uvicorn.Server(config)
print(f"✅ Starting server on port {PORT}...")
asyncio.get_event_loop().run_until_complete(server.serve())
