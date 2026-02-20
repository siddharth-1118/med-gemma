import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

# Test gemini-2.0-flash as it's in the list
model = 'gemini-2.0-flash'
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
payload = {"contents": [{"parts":[{"text": "ping"}]}]}

print(f"Testing model: {model}")
try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"SUCCESS! Response: {response.json()['candidates'][0]['content']['parts'][0]['text']}")
    else:
        print(f"FAILURE! {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
