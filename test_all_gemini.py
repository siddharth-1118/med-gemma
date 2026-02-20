import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

def test_model(model_id):
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_id}:generateContent?key={key}"
    payload = {"contents": [{"parts":[{"text": "ping"}]}]}
    try:
        response = requests.post(url, json=payload, timeout=5)
        return response.status_code, response.text
    except Exception as e:
        return 999, str(e)

print("Fetching model list...")
list_url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
res = requests.get(list_url)
if res.status_code == 200:
    models = res.json().get('models', [])
    for m in models:
        m_name = m['name']
        if 'generateContent' in m['supportedGenerationMethods']:
            print(f"Testing {m_name}...", end=" ", flush=True)
            code, text = test_model(m_name)
            print(f"Status: {code}")
            if code == 200:
                print(f"  -> SUCCESS! Result: {text[:50]}...")
            elif code == 429:
                print("  -> QUOTA EXCEEDED")
else:
    print(f"Failed to list models: {res.status_code}")
