from pydantic import BaseModel, EmailStr

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str

