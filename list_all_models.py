import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"

response = requests.get(url)
if response.status_code == 200:
    models = response.json().get('models', [])
    names = [m['name'] for m in models if 'gemini' in m['name'].lower()]
    print("ALL_MODELS_START")
    for name in names:
        print(name)
    print("ALL_MODELS_END")
else:
    print(f"FAILED: {response.status_code}")
