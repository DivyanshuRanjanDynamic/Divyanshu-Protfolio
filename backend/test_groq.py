import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
print("API Key loaded:", api_key[:10] if api_key else "None")

client = Groq(api_key=api_key)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "You are a helpful assistant for Divyanshu Ranjan."},
        {"role": "user", "content": "Summarize Divyanshu's backend experience in one sentence."}
    ],
    temperature=0.3,
    max_tokens=150
)

print("Groq Response:\n", response.choices[0].message.content)
