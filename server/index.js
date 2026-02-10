import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Client } from "@gradio/client";


const app = express();
const port = 3000;

// Enable CORS for Frontend
app.use(cors());
app.use(express.json());

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mock Analysis Logic
const MEDICAL_SYSTEM_PROMPT = `
You are a medical multimodal analysis assistant.
CRITICAL SAFETY RULE: You MUST NOT analyze non-medical images.

STEP 1: IMAGE TYPE VERIFICATION
- Is it a valid medical image (X-ray, CT, MRI)?
- If NO (selfie, object, etc.): STOP. Output: "The uploaded image does not appear to be a medical radiology image."

STEP 2: MEDICAL ANALYSIS (Only if Valid)
- Specific visual observations.
- Grounded in image features.

Output structure (JSON):
{
  "imageFindings": "Visual observations OR Rejection Message",
  "abnormalityLocation": "Location/Extent/Confidence",
  "correlation": "Correlation with text",
  "negativeFindings": "Absent findings",
  "uncertainty": "Confidence level",
  "suggestions": "Next steps"
}
`;

// Mock Analysis Logic - Updated to 7-Step Strict Protocol
const DEMO_RESPONSES = {
    'case1': {
        imageFindings: [
            "Focal opacity observed in the right lower lung zone.",
            "Opacification is patchy and ill-defined.",
            "Air bronchograms are visible within the opacity.",
            "Left lung field is clear.",
            "No pleural effusion or pneumothorax visible."
        ],
        abnormalityLocation: "Right Lower Lobe (Posterior basal segment). Moderate extent. High visual confidence.",
        correlation: "Option A: Image supports the clinical presentation. The focal RLL consolidation matches the history of fever and cough.",
        negativeFindings: [
            "No large pleural effusion.",
            "No pneumothorax.",
            "No hilar adenopathy."
        ],
        uncertainty: "Moderate Confidence. Retrocardiac area is partially obscured.",
        suggestions: [
            "Correlate with inflammatory markers (CRP/WBC).",
            "Follow-up Chest X-ray in 2-4 weeks to confirm resolution."
        ],
        isInconsistent: false
    },
    'case2': {
        imageFindings: [
            "Clear lung fields bilaterally.",
            "No focal consolidation or acute opacity.",
            "Frank transverse fracture of the distal radius/ulna (forearm) clearly visible.",
            "Soft tissue swelling around the fracture site."
        ],
        abnormalityLocation: "Distal Radius/Ulna (Forearm). High visual confidence.",
        correlation: "Option C: Image does NOT support the clinical presentation. Patient complains of 'Abdominal Pain', but image shows a forearm fracture.",
        negativeFindings: [
            "No abdominal pathology visible (wrong body part).",
            "No chest pathology."
        ],
        uncertainty: "High Confidence in mismatch.",
        suggestions: [
            "CRITICAL: Verify patient identity and uploaded file.",
            "Reject image: Wrong modality/body part."
        ],
        isInconsistent: true
    }
};

const GENERIC_RESPONSE = {
    imageFindings: [
        "Lung fields are clear bilaterally.",
        "No focal consolidation, effusion, or pneumothorax.",
        "Cardiomediastinal silhouette is within normal limits.",
        "Pulmonary vasculature is normal."
    ],
    abnormalityLocation: "No clearly localizable abnormal region is identified.",
    correlation: "Option B: Image partially supports the clinical presentation. Normal CXR does not rule out viral bronchitis or early infection.",
    negativeFindings: [
        "No acute fracture.",
        "No pulmonary edema."
    ],
    uncertainty: "Low Confidence. limited by single AP view.",
    suggestions: [
        "Clinical correlation required.",
        "Consider CT if suspicion for PE or occult disease is high."
    ],
    isInconsistent: false
};

const AI_SERVICE_URL = process.env.AI_SERVICE_URL; // e.g. "https://<gradio-id>.gradio.live"

// API Endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    console.log('Received analysis request');

    if (req.file) {
        console.log(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
    }

    const caseId = req.body.caseId;

    // 1. Try Real AI (FastAPI or Gradio)
    if (AI_SERVICE_URL) {
        console.log(`Forwarding to AI Service: ${AI_SERVICE_URL}`);
        try {
            // Check if it's a Gradio URL (basic heuristic) or our FastAPI
            if (AI_SERVICE_URL.includes("gradio")) {
                const client = await Client.connect(AI_SERVICE_URL);
                const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
                const userPrompt = req.body.prompt || "describe the medical condition in this x-ray";
                const fullPrompt = `${MEDICAL_SYSTEM_PROMPT}\n\nUser Context: ${userPrompt}`;
                const result = await client.predict("/predict", { image: blob, prompt: fullPrompt });
                const jsonResponse = result.data ? result.data[0] : null;
                const data = typeof jsonResponse === 'string' ? JSON.parse(jsonResponse) : jsonResponse;
                return res.json(data);
            } else {
                // Assume Standard REST API (FastAPI)
                const formData = new FormData();
                const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
                formData.append('image', fileBlob, req.file.originalname);
                formData.append('prompt', req.body.prompt || "medical analysis");

                const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
                const data = await response.json();
                return res.json(data);
            }

        } catch (error) {
            console.error("Failed to connect to AI Service:", error.message);
            console.log("Falling back to Demo Data...");
        }
    }

    // 2. Fallback to Demo Data
    // Simulate AI Processing Delay (2 seconds)
    setTimeout(() => {
        if (caseId && DEMO_RESPONSES[caseId]) {
            console.log(`Returning specific analysis for ${caseId}`);
            res.json(DEMO_RESPONSES[caseId]);
        } else {
            console.log('Returning generic analysis for new/custom upload');
            res.json(GENERIC_RESPONSE);
        }
    }, 2000);
});

app.listen(port, () => {
    console.log(`MedGemma Backend running on http://localhost:${port}`);
});
