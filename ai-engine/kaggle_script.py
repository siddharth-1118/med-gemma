
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
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

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
    messages = [{"role": "user", "content": [
        {"type": "image", "image": image},
        {"type": "text", "text": f"You are a medical AI. Analyze this image.\n\nContext: {prompt}\n\nReturn JSON with keys: image_findings, confidence, uncertainties, followUps. Be specific and detailed."}
    ]}]
    inputs = processor.apply_chat_template(
        messages, add_generation_prompt=True, tokenize=True,
        return_dict=True, return_tensors="pt"
    ).to(model.device, dtype=torch.bfloat16)
    input_len = inputs["input_ids"].shape[-1]
    with torch.inference_mode():
        out = model.generate(**inputs, max_new_tokens=512, do_sample=False, temperature=1.0)
    decoded = processor.decode(out[0][input_len:], skip_special_tokens=True).strip()
    try:
        m = re.search(r'\{.*\}', decoded, re.DOTALL)
        if m: return json.loads(m.group())
    except: pass
    return {"image_findings": decoded, "confidence": "High (MedGemma-1.5-4b-it GPU)",
            "uncertainties": "Clinical correlation recommended.", "followUps": ["Verify with radiologist"]}

def _gemini_inference(image: Image.Image, prompt: str) -> dict:
    for m in ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"]:
        try:
            gm = genai.GenerativeModel(m)
            p = f"""You are a medical radiologist AI. Analyze this medical image.
Clinical context: {prompt}
Return ONLY valid JSON (no markdown) with keys:
- image_findings: detailed paragraph of findings (min 3 sentences)
- confidence: high/moderate/low
- uncertainties: what is absent or unclear
- followUps: list of recommended actions"""
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

@app.post("/analyze")
async def analyze(image: UploadFile = File(...), prompt: str = Form("")):
    try:
        pil = Image.open(io.BytesIO(await image.read()))
        if not prompt: prompt = "Describe the medical findings in this image."
        result = _local_inference(pil, prompt) if (model and processor) else _gemini_inference(pil, prompt)
        return result
    except Exception as e:
        return {"error": str(e), "image_findings": "Analysis failed."}

@app.post("/symptom_analysis")
async def symptom_analysis(problem: str = Form(...)):
    for m in ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"]:
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
    for m in ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"]:
        try:
            gm = genai.GenerativeModel(m)
            return gm.generate_content(f"You are a medical AI. Answer safely: {message}").text
        except: continue
    return "I'm having trouble connecting. Please try again."

@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket):
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

config = uvicorn.Config(app, host="0.0.0.0", port=PORT, log_level="info")
server = uvicorn.Server(config)
print(f"✅ Starting server on port {PORT}...")
asyncio.get_event_loop().run_until_complete(server.serve())
