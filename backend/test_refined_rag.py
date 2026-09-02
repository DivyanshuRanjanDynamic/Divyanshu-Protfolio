import os
from dotenv import load_dotenv
from services.rag_service import RAGService

load_dotenv()
data_path = os.path.join(os.path.dirname(__file__), "data", "profile.json")
rag = RAGService(data_path=data_path)

queries = [
    "Summarize his backend experience",
    "Is he available for internships?",
    "Show projects using AWS"
]

for q in queries:
    print(f"\n================ QUERY: {q} ================")
    answer = rag.generate_response(q)
    print(answer.encode('ascii', errors='ignore').decode('ascii'))
