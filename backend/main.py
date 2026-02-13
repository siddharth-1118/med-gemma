
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
import json
import logging
import os

from . import models, database, auth, ai_service

# Initialize DB
# Initialize DB
from dotenv import load_dotenv
load_dotenv()
models.Base.metadata.create_all(bind=database.engine)

# Initialize AI
# Initialize AI
ai_service.load_models()
ai_service.configure_genai(os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="MedGemma Collaboration Platform")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# --- AUTH ROUTES ---

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.post("/register")
async def register_user(username: str = Form(...), password: str = Form(...), role: str = Form("uploader"), db: Session = Depends(database.get_db)):
    # Check if user exists
    if db.query(models.User).filter(models.User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(password)
    new_user = models.User(username=username, hashed_password=hashed_password, role=role)
    db.add(new_user)
    db.commit()
    return {"msg": "User created successfully"}

# --- AI & CASE ROUTES ---

@app.post("/analyze")
async def analyze_case(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    token: str = Depends(auth.oauth2_scheme), # Require Auth
    db: Session = Depends(database.get_db)
):
    # 1. Image Processing
    contents = await image.read()
    try:
        pil_image = ai_service.process_medical_image(contents, image.filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Image Format")

    # 2. Safety Gating
    if not ai_service.classify_is_medical(pil_image):
        return {
            "image_type": "non-medical",
            "error": "Image rejected. Please upload a valid medical radiology image."
        }

    # 3. AI Analysis
    # 3. AI Analysis
    result = ai_service.analyze_with_gemini(pil_image, prompt)
    
    # 4. Create Case in DB
    user = auth.get_current_user(token, db)
    # Save image to disk (mock path for now)
    image_path = f"uploads/{image.filename}" 
    # Ensure directory exists in real app
    
    new_case = models.Case(
        patient_id_hash="demo_hash", 
        image_path=image_path, 
        ai_result_json=json.dumps(result),
        status="pending_review"
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # 5. Notify Reviewers via WebSocket
    await manager.broadcast(json.dumps({
        "type": "new_case", 
        "case_id": new_case.id, 
        "summary": result['image_findings'][:50] + "..."
    }))

    return result

@app.get("/cases")
async def get_cases(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    cases = db.query(models.Case).all()
    # Parse JSON for frontend
    results = []
    for c in cases:
        c_dict = c.__dict__
        if '_sa_instance_state' in c_dict: del c_dict['_sa_instance_state']
        c_dict['ai_result'] = json.loads(c.ai_result_json) if c.ai_result_json else {}
        results.append(c_dict)
    return results

# --- WEBSOCKET ENDPOINT ---

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast message to all doctors
            await manager.broadcast(f"Doctor says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
