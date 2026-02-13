
import unittest
from unittest.mock import MagicMock, sys

# 1. Mock External Deps BEFORE anything else
sys.modules["transformers"] = MagicMock()
sys.modules["torch"] = MagicMock()
sys.modules["uvicorn"] = MagicMock()
sys.modules["fastapi"] = MagicMock()
sys.modules["numpy"] = MagicMock()
sys.modules["cv2"] = MagicMock()
sys.modules["PIL"] = MagicMock()
sys.modules["pydicom"] = MagicMock()

# 2. Setup path to include current directory (explicitly)
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# 3. Import the module under test
# We wrap in try specific import to debug
try:
    import medgemma_api
except ImportError as e:
    print(f"CRITICAL IMPORT ERROR: {e}")
    print(f"Current Path: {sys.path}")
    print(f"Files in dir: {os.listdir(current_dir)}")
    raise e

class TestMedicalLogic(unittest.TestCase):

    def setUp(self):
        self.dummy_img = MagicMock() # Mock the PIL image object

    def test_gating_rejection(self):
        """ Test that non-medical images are rejected (return False) """
        # We need to mock the classifier inside medgemma_api
        # Since we imported medgemma_api, we can modify its classifier global
        
        # Mock result for "cat"
        mock_result = [{'label': 'tabby, tabby cat', 'score': 0.99}]
        
        # Test helper function
        # But wait, medgemma_api.classify_image_type uses the global `classifier` object.
        # We need to set it.
        medgemma_api.classifier = MagicMock(return_value=mock_result)
        
        is_medical = medgemma_api.classify_image_type(self.dummy_img)
        print(f"\n[Test] Input: 'Tabby Cat' -> Detected: {is_medical}")
        self.assertFalse(is_medical, "Cat image should be rejected")

    def test_gating_acceptance(self):
        """ Test that medical images are accepted (return True) """
        mock_result = [{'label': 'radiograph', 'score': 0.95}]
        medgemma_api.classifier = MagicMock(return_value=mock_result)
        
        is_medical = medgemma_api.classify_image_type(self.dummy_img)
        print(f"[Test] Input: 'Radiograph' -> Detected: {is_medical}")
        self.assertTrue(is_medical, "Radiograph should be accepted")

    def test_gating_heuristic_fallback(self):
        """ Test fallback list """
        mock_result = [{'label': 'screen, crt screen', 'score': 0.8}]
        medgemma_api.classifier = MagicMock(return_value=mock_result)
        
        is_medical = medgemma_api.classify_image_type(self.dummy_img)
        print(f"[Test] Input: 'Screen' -> Detected: {is_medical}")
        self.assertTrue(is_medical, "Screen/Monitor should be accepted")

if __name__ == '__main__':
    unittest.main()
