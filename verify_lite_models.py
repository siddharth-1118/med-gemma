import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05')
    response = model.generate_content("Hello")
    print(f"SUCCESS_LITE_PREVIEW: {response.text}")
except Exception as e:
    print(f"FAILED_LITE_PREVIEW: {e}")

try:
    # Testing the lite-latest one we saw
    model = genai.GenerativeModel('gemini-flash-lite-latest')
    response = model.generate_content("Hello")
    print(f"SUCCESS_FLASH_LITE_LATEST: {response.text}")
except Exception as e:
    print(f"FAILED_FLASH_LITE_LATEST: {e}")
