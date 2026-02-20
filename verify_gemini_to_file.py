import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-2.0-flash-lite-preview-02-05')
    response = model.generate_content("Give me a very short medical fact about the heart.")
    with open("gemini_proof.txt", "w") as f:
        f.write("CONNECTION SUCCESSFUL\n")
        f.write(f"Response: {response.text}")
except Exception as e:
    with open("gemini_proof.txt", "w") as f:
        f.write("CONNECTION FAILED\n")
        f.write(f"Error: {str(e)}")
