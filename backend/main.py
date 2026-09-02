import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from schemas import ContactRequest, ContactResponse, ChatRequest, ChatResponse
from services.email_service import send_contact_email
from services.rag_service import RAGService
from services.chat_service import process_chat_message

load_dotenv()

app = FastAPI(title="Portfolio Backend")

# Initialize RAG Service with single source of truth data
data_path = os.path.join(os.path.dirname(__file__), "data", "profile.json")
rag_service = RAGService(data_path=data_path)

# Allow CORS for frontend (local and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://divyanshu.online", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "rag_chunks_loaded": len(rag_service.chunks)}

@app.get("/api/debug")
def debug_check():
    return {
        "groq_client_initialized": rag_service.client is not None,
        "rag_chunks_loaded": len(rag_service.chunks),
        "groq_key_present": bool(os.getenv("GROQ_API_KEY")),
        "resend_key_present": bool(os.getenv("RESEND_API_KEY")),
        "contact_email": os.getenv("CONTACT_TO_EMAIL", "NOT SET"),
    }

@app.post("/api/contact", response_model=ContactResponse)
def handle_contact(request: ContactRequest):
    success = send_contact_email(request.name, request.email, request.message)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"success": True, "message": "Email sent successfully"}

from services.activity_service import get_live_activity_stats

@app.get("/api/activity")
def get_activity(refresh: bool = False):
    return get_live_activity_stats(force_refresh=refresh)

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    result = process_chat_message(rag_service, request.message, request.session_id)
    return ChatResponse(reply=result["reply"], session_id=result["session_id"])

