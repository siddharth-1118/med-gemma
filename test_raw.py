import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

print(f"Testing key: {key[:5]}...")
try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("SUCCESS! Available Models:")
        models = response.json().get('models', [])
        for m in models:
            name = m['name']
            if 'gemini' in name.lower():
                print(f"MODEL: {name}")
    else:
        print("FAILURE! Response Body:")
        print(response.text)
except Exception as e:
    print(f"ERROR: {e}")
