import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

print(f"Using Key: {key[:5]}...")

try:
    genai.configure(api_key=key)
    # Testing with the model we found available
    model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05')
    response = model.generate_content("Give me a very short medical fact about the heart.")
    print("SUCCESS! Gemini Library Response:")
    print(response.text)
except Exception as e:
    print(f"FAILURE! Error: {e}")
