import os
import json
import re
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq

OFF_TOPIC_REDIRECT = (
    "I am specifically designed to answer questions about Divyanshu Ranjan's professional background, skills, "
    "projects, and experience. For general coding tasks, tutorials, or off-topic questions, feel free to reach "
    "out to Divyanshu directly via email at divyanshu.work914214@gmail.com or connect on LinkedIn at "
    "https://linkedin.com/in/divyanshuranjan01!"
)

SIMILARITY_THRESHOLD = 0.10

def is_off_topic_intent(query: str) -> bool:
    q_lower = query.lower().strip()
    
    # Personal/profile keywords that indicate a candidate query
    personal_keywords = ["divyanshu", "he ", "his ", "him ", "you ", "your ", "candidate", "resume", "portfolio", "fit for"]
    has_personal_ref = any(k in q_lower for k in personal_keywords)

    # 1. General Coding Generation & Math/LeetCode problem-solving requests
    coding_patterns = [
        r"\b(write|create|generate|implement|build)\s+.*?\b(program|code|script|function|algorithm|class|method|app|bot|solution)\b",
        r"\bcode\s+(for|to|that)\b",
        r"\badd\s+two\s+numbers\b",
        r"\bfactorial\b",
        r"\bfibonacci\b",
        r"\breverse\s+a\s+string\b",
        r"\bprint\s+hello\s+world\b",
        r"\bsolve\s+(this\s+)?(equation|math|problem|leetcode)\b"
    ]
    for pat in coding_patterns:
        if re.search(pat, q_lower):
            return True

    # 2. General Trivia & Math
    trivia_patterns = [
        r"\bcapital\s+of\b",
        r"\bwhat\s+is\s+the\s+capital\b",
        r"\bwho\s+is\s+(the\s+)?(president|prime\s+minister|king|queen|ceo)\b",
        r"\bweather\s+in\b",
        r"\btell\s+me\s+a\s+joke\b",
        r"\b\d+\s*[\+\-\*\/]\s*\d+\b"
    ]
    for pat in trivia_patterns:
        if re.search(pat, q_lower):
            return True

    # 3. General CS Concept Explanations (when not asking specifically about Divyanshu's profile/experience)
    cs_explain_patterns = [
        r"\bexplain\s+how\s+(a|an|the)?\s*([a-z\s]+)\s+works?\b",
        r"\bwhat\s+is\s+(a|an)\s+(hash\s*map|binary\s*tree|linked\s*list|stack|queue|graph|heap|trie|b-tree|mutex|semaphore)\b",
        r"\bexplain\s+(recursion|object\s+oriented|oop|polymorphism|inheritance|encapsulation|concurrency|multithreading|async|event\s+loop)\b",
        r"\bhow\s+does\s+([a-z\s]+)\s+work\s+under\s+the\s+hood\b"
    ]
    if not has_personal_ref:
        for pat in cs_explain_patterns:
            if re.search(pat, q_lower):
                return True

    return False


class RAGService:
    def __init__(self, data_path: str):
        self.data_path = data_path
        self.chunks: List[Dict[str, str]] = []
        self.vectorizer = None
        self.chunk_vectors = None
        self.client = None
        self._load_and_chunk_data()
        self._init_groq()

    def _init_groq(self):
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("API_KEY")
        if api_key:
            try:
                self.client = Groq(api_key=api_key.strip())
            except Exception as e:
                print("Error initializing Groq client:", e)
                self.client = None
        else:
            print("WARNING: GROQ_API_KEY not found in environment.")

    def _load_and_chunk_data(self):
        # Search candidate paths for profile.json on Vercel serverless / Render
        candidate_paths = [
            self.data_path,
            os.path.join(os.path.dirname(__file__), "..", "data", "profile.json"),
            os.path.join(os.getcwd(), "data", "profile.json"),
            os.path.join(os.getcwd(), "backend", "data", "profile.json"),
        ]

        data = None
        for p in candidate_paths:
            if p and os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        print(f"Successfully loaded profile data from: {p}")
                        break
                except Exception as e:
                    print(f"Error loading from {p}: {e}")

        if not data:
            print("Error: Could not locate profile.json in any candidate path.")
            return

        chunks = []

        # 1. Profile / Meta Chunk
        meta = data.get("meta", {})
        edu = data.get("education", {})
        bio_chunk = (
            f"Candidate Name: {meta.get('name')}\n"
            f"Roles: {', '.join(meta.get('roles', []))}\n"
            f"Tagline: {meta.get('tagline')}\n"
            f"Education: {edu.get('degree')} at {edu.get('institution')} (GPA: {edu.get('gpa')}, {edu.get('period')})\n"
            f"Contact Email: {meta.get('email')}\n"
            f"Phone: {meta.get('phone')}\n"
            f"GitHub: {meta.get('github')}\n"
            f"LinkedIn: {meta.get('linkedin')}\n"
            f"Resume URL: {meta.get('resumeUrl')}\n"
            f"Availability & Status: Currently open to Internship, Co-op, and Full-Time roles in Full Stack, Backend, AI Engineering, and Software Engineering."
        )
        chunks.append({"id": "meta_edu", "type": "profile", "content": bio_chunk})

        # 2. Skills Chunks
        skills = data.get("skills", {})
        for category, item_list in skills.items():
            skill_chunk = f"Category: {category} Technical Skills\nSkills: {', '.join(item_list)}"
            chunks.append({"id": f"skill_{category}", "type": "skills", "content": skill_chunk})

        # 3. Work Experience Chunks
        for idx, exp in enumerate(data.get("experience", [])):
            exp_text = (
                f"Work Experience: {exp.get('title')} at {exp.get('company')} ({exp.get('location')}, {exp.get('period')})\n"
                f"Technologies Used: {', '.join(exp.get('tech', []))}\n"
                f"Key Impact & Bullets:\n- " + "\n- ".join(exp.get('bullets', []))
            )
            chunks.append({"id": f"exp_{idx}", "type": "experience", "content": exp_text})

        # 4. Projects Chunks
        for idx, proj in enumerate(data.get("projects", [])):
            proj_text = (
                f"Project Name: {proj.get('name')} - {proj.get('subtitle')}\n"
                f"Live Demo URL: {proj.get('live') or 'N/A'}\n"
                f"GitHub Repository: {proj.get('github')}\n"
                f"Technologies Used: {', '.join(proj.get('tech', []))}\n"
                f"Details & Metrics:\n- " + "\n- ".join(proj.get('bullets', []))
            )
            chunks.append({"id": f"proj_{idx}", "type": "project", "content": proj_text})

        # 5. Achievements Chunk
        achievements = data.get("achievements", [])
        ach_texts = [f"- {a.get('title')}: {a.get('description')}" for a in achievements]
        ach_chunk = "Achievements & Honors:\n" + "\n".join(ach_texts)
        chunks.append({"id": "achievements", "type": "achievements", "content": ach_chunk})

        self.chunks = chunks

        # Build TF-IDF vector matrix for fast cosine similarity
        corpus = [c["content"] for c in self.chunks]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.chunk_vectors = self.vectorizer.fit_transform(corpus)

    def retrieve_context(self, query: str, top_k: int = 4) -> Tuple[str, float]:
        if not self.vectorizer or self.chunk_vectors is None or not self.chunks:
            return "", 0.0

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.chunk_vectors).flatten()
        max_sim = float(similarities.max()) if len(similarities) > 0 else 0.0

        top_indices = similarities.argsort()[::-1][:top_k]
        retrieved_texts = [self.chunks[i]["content"] for i in top_indices if similarities[i] > 0.01]
        
        if not retrieved_texts:
            retrieved_texts = [self.chunks[i]["content"] for i in top_indices[:3]]

        context_str = "\n\n---\n\n".join(retrieved_texts)
        return context_str, max_sim

    def generate_response(self, query: str, history: List[Dict[str, str]] = None) -> str:
        # 1. Pre-Retrieval Intent Filter Check
        if is_off_topic_intent(query):
            return OFF_TOPIC_REDIRECT

        if not self.client:
            self._init_groq()

        if not self.client:
            return "I am currently undergoing maintenance (Groq API Key unavailable). Please feel free to email Divyanshu directly at divyanshu.work914214@gmail.com!"

        # 2. Similarity Score Threshold Check
        context, max_sim = self.retrieve_context(query)
        if max_sim < SIMILARITY_THRESHOLD:
            return OFF_TOPIC_REDIRECT

        # 3. System Prompt Boundaries & Guardrails
        system_prompt = (
            "You are Divyanshu Ranjan's AI Portfolio Assistant.\n"
            "YOUR ONLY PURPOSE is to answer questions directly related to Divyanshu Ranjan's professional background, skills, projects, experience, education, achievements, fit for software engineering/AI/backend roles, and contact details, strictly using the provided context.\n\n"
            "STRICT BOUNDARY & SAFETY RULES:\n"
            "1. NO GENERAL CODING / NO MATH / NO TRIVIA / NO CS TUTORIALS:\n"
            "   - Do NOT write code snippets, solve programming problems, perform mathematical calculations, answer general trivia, or explain general computer science concepts (e.g. data structures, algorithms, how databases/Kafka work in general).\n"
            "   - Even if a programming language or tool (e.g. Java, Python, Kafka) is listed in Divyanshu's skills, knowing a skill is listed is NOT permission to demonstrate, teach, or write code in that language.\n"
            "   - If asked an off-topic question, politely decline and state: 'I am specifically designed to answer questions about Divyanshu Ranjan's professional background, skills, projects, and experience. For general coding tasks, tutorials, or off-topic questions, feel free to reach out to Divyanshu directly via email at divyanshu.work914214@gmail.com or connect on LinkedIn at https://linkedin.com/in/divyanshuranjan01!'\n"
            "2. NO ASTERISKS: Do NOT use `**` or `*` asterisks anywhere for bold text. Write project titles, company names, and headers plainly without asterisks.\n"
            "3. SECTION SEPARATORS: Insert a dashed line `---` on a new line between separate projects, experience items, or distinct sections so the reader can understand the sections properly.\n"
            "4. BE CONCISE: Keep answers brief (maximum 2-3 short bullet points per section). Avoid fluff or filler words.\n"
            "5. DIRECT START: Start directly with the answer. Do NOT add meta-introductions like 'Based on the context', 'Sure!', or 'Here is the summary'.\n"
            "6. KEY EVIDENCE: Highlight quantified metrics (e.g., 500+ CAD users, 1,000+ concurrent users, 92% matching accuracy, 200ms latency) and relevant tech stacks.\n"
            "7. CLICKABLE LINKS: Include markdown links when referencing projects or links: e.g. [MechHub](https://www.mechhub.in/) or [GitHub](https://github.com/DivyanshuRanjanDynamic) or [Resume](https://1drv.ms/b/c/ec04afbe3c304831/IQCoUeLZmg09QbqKvtR_WMGlAdUy6oQM86RJazeR5amfmmE?e=5ccO2h).\n"
            "8. STRICT FACTUALITY: Only state facts present in the Context.\n\n"
            f"CONTEXT:\n{context}"
        )

        messages = [{"role": "system", "content": system_prompt}]
        
        if history:
            for msg in history[-4:]:  # include up to last 4 messages for tight context
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": query})

        try:
            response = self.client.chat.completions.create(
                model="groq/compound",
                messages=messages,
                temperature=0.2,
                max_tokens=350
            )
            raw_text = response.choices[0].message.content.strip()
            return raw_text.replace("**", "")
        except Exception as e:
            try:
                response = self.client.chat.completions.create(
                    model="openai/gpt-oss-120b",
                    messages=messages,
                    temperature=0.2,
                    max_tokens=350
                )
                return response.choices[0].message.content.strip().replace("**", "")
            except Exception as e2:
                print(f"RAG Error: {e2}")
                return OFF_TOPIC_REDIRECT
