import os
from dotenv import load_dotenv
import resend

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

try:
    r = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": [os.getenv("CONTACT_TO_EMAIL")],
        "subject": "Test",
        "html": "<p>Test</p>"
    })
    print("Success:", r)
except Exception as e:
    print("Error:", e)
