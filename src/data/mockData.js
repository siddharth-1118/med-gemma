export const DEMO_CASES = {
  case1: {
    id: 'case1',
    title: 'Post-Recovery Checkup (Consistent)',
    patient: {
      age: 65,
      sex: 'Male',
      history: 'COPD, Hypertension, 30-pack-year smoking history',
      chiefComplaint: 'Productive cough, low-grade fever (100.2°F)',
      notes: 'Patient presents for follow-up. Reports persistent cough with green sputum for 3 days. Oxygen saturation 94% on room air. Auscultation reveals crackles in right base.'
    },
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1000&auto=format&fit=crop',
    analysis: {
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
    }
  },
  case2: {
    id: 'case2',
    title: 'Trauma Evaluation (Inconsistent)',
    patient: {
      age: 24,
      sex: 'Female',
      history: 'No significant past medical history',
      chiefComplaint: 'Diffuse abdominal pain, nausea',
      notes: 'Patient reports onset of pain after meal. Denies unsteadiness or falls. No external bruising or trauma evident on physical exam.'
    },
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf4722e12?q=80&w=1000&auto=format&fit=crop',
    analysis: {
      jointInterpretation: [
        "CRITICAL ALERT: Imaging reveals a complete transverse fracture of the radius/ulna",
        "Patient chief complaint is 'Abdominal Pain' with 'No trauma history'",
        "There is a zero-correlation between the provided orthopaedic image and the gastroenterological clinical notes",
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
  }
};
