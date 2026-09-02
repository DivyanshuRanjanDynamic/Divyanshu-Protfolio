import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

models_to_test = [
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
]

for model in models_to_test:
    try:
        res = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        print(f"SUCCESS model '{model}':", res.choices[0].message.content)
        break
    except Exception as e:
        print(f"FAILED model '{model}':", e)
