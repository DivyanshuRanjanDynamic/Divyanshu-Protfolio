import os
import resend

def send_contact_email(name: str, email: str, message: str) -> bool:
    resend.api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("CONTACT_TO_EMAIL")

    if not resend.api_key or not to_email:
        print("Error: Missing RESEND_API_KEY or CONTACT_TO_EMAIL in environment")
        return False

    html_content = f"""
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
      {message}
    </blockquote>
    """

    try:
        r = resend.Emails.send({
            "from": "Portfolio Contact <onboarding@resend.dev>",
            "to": [to_email],
            "subject": f"New message from {name}",
            "html": html_content
        })
        print(f"Email sent successfully: {r}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
