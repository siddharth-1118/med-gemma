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
const DEMO_RESPONSES = {
    'case1': {
        jointInterpretation: [
            "Radiographic opacity observed in the right lower lobe consistent with consolidation",
            "Clinical history of fever and productive cough correlates with imaging findings",
            "Pattern is highly suggestive of bacterial pneumonia given the patient profile"
        ],
        clinicalContext: 'High-risk patient (Age 65+, smoker). Findings warrant immediate intervention.',
        uncertainties: 'Cardiac silhouette slightly obscured; cannot rule out minor effusion.',
        followUps: [
            'Initiate empiric antibiotic therapy',
            'Sputum culture and sensitivity',
            'Follow-up Chest X-ray in 14 days'
        ],
        isInconsistent: false
    },
    'case2': {
        jointInterpretation: [
            "CRITICAL ALERT: Imaging reveals a complete transverse fracture of the radius/ulna",
            "Patient chief complaint is 'Abdominal Pain' with 'No trauma history'",
            "This represents a zero-correlation event between orthogonal data modalities",
            "High probability of file mismatch or wrong image upload"
        ],
        clinicalContext: 'POTENTIAL PATIENT SAFETY EVENT. Mismatched records can lead to erroneous treatment.',
        uncertainties: 'Cannot reconcile limb fracture with abdominal symptoms.',
        followUps: [
            'HALT clinical decision making',
            'Verify Patient Name and DOB on image metadata',
            'Manually re-order imaging study'
        ],
        isInconsistent: true
    }
};

const GENERIC_RESPONSE = {
    jointInterpretation: [
        "Image quality sufficient for automated multimodal screening",
        "No critical inconsistencies detected with submitted patient metadata",
        "Findings require radiologist correlation for final clinical sign-off"
    ],
    clinicalContext: 'External image import. Verification required.',
    uncertainties: 'Patient positioning varies from baseline protocol.',
    followUps: ['Confirm patient ID matches image metadata', 'Standard diagnostic review'],
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

    // 1. Try Real AI (if configured)
    if (AI_SERVICE_URL) {
        console.log(`Forwarding to AI Service: ${AI_SERVICE_URL}`);
        try {
            // Initialize Gradio Client
            const client = await Client.connect(AI_SERVICE_URL);

            // Convert buffer to Blob for Gradio (requires global Blob/File if Node 18+)
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

            const result = await client.predict("/predict", {
                image: blob,
                prompt: "describe the medical condition in this x-ray",
            });

            if (result && result.data) {
                // Gradio returns array of outputs. Our output is index 0 (JSON)
                // Depending on Gradio version it might be result.data[0]
                const jsonResponse = result.data[0];

                // If it's a string, parse it. If object, use directly.
                const data = typeof jsonResponse === 'string' ? JSON.parse(jsonResponse) : jsonResponse;

                console.log("AI Analysis Successful");
                return res.json(data);
            } else {
                throw new Error("Invalid response from Gradio");
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
