import uuid
from typing import Dict, List, Any
from services.rag_service import RAGService

# In-memory session store for chat history
SESSION_STORE: Dict[str, List[Dict[str, str]]] = {}

def get_or_create_session_id(session_id: str = None) -> str:
    if not session_id or session_id not in SESSION_STORE:
        session_id = str(uuid.uuid4())
        SESSION_STORE[session_id] = []
    return session_id

def process_chat_message(rag_service: RAGService, message: str, session_id: str = None) -> Dict[str, str]:
    sid = get_or_create_session_id(session_id)
    history = SESSION_STORE[sid]

    # Generate response via RAG
    reply = rag_service.generate_response(message, history)

    # Append to history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": reply})

    # Keep history bounded (max 10 turns)
    if len(history) > 20:
        SESSION_STORE[sid] = history[-20:]

    return {
        "reply": reply,
        "session_id": sid
    }
