import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

res = client.chat.completions.create(
    model="groq/compound",
    messages=[{"role": "user", "content": "Say hello to Divyanshu!"}],
    max_tokens=30
)
print(res.choices[0].message.content.encode('ascii', errors='ignore').decode('ascii'))
