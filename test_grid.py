import requests
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

models_to_test = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-flash-latest']
versions = ['v1', 'v1beta']

for version in versions:
    for model in models_to_test:
        url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent?key={key}"
        payload = {"contents": [{"parts":[{"text": "ping"}]}]}
        try:
            response = requests.post(url, json=payload)
            print(f"{version} / {model}: {response.status_code}")
            if response.status_code == 200:
                print(f"  SUCCESS! {response.json()['candidates'][0]['content']['parts'][0]['text'][:20]}")
        except Exception as e:
            print(f"{version} / {model}: ERROR {e}")
