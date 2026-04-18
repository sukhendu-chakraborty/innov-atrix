from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import warnings
import schemas

# Suppress some transformers warnings for clean logs
warnings.filterwarnings("ignore", category=FutureWarning)

# Load the semantic model globally to persist in FastAPI memory
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_student_skills_text(student: schemas.StudentProfileInput) -> str:
    """Computes a rich text profile for the student tying together skills, description, and past experiences."""
    # We combine them so the Neural Net can find overlap in how they talk about their past exp vs the bounty
    return f"Skills: {student.skills} | Description: {student.description} | Past Experience: {student.pastExperiences}"

def find_best_students(bounty_description: str, students: List[schemas.StudentProfileInput], top_n: int = 3) -> List[Dict[str, Any]]:
    """
    Matches a bounty description to a list of fully agnostic JSON student profiles based on their semantic embedding.
    """
    if not students or not bounty_description.strip():
        return []
        
    # Generate the rich text strings
    student_documents = [get_student_skills_text(s) for s in students]
    
    # Generate dense vector embeddings
    bounty_embedding = model.encode([bounty_description])
    student_embeddings = model.encode(student_documents)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(bounty_embedding, student_embeddings).flatten()
    
    # Pair similarities with students
    student_scores = []
    for idx, score in enumerate(similarities):
        student = students[idx]
        
        # Raw semantic semantic similarity
        ai_similarity = float(score) * 100.0 
        
        # Compute individual metrics (with text heuristics fallback if DB floats are 0)
        exp_score = min(student.experience_years * 20.0, 100.0) if student.experience_years else min(len(student.pastExperiences) / 50.0, 1.0) * 100.0
        rating_score = min(student.work_ratings * 20.0, 100.0) if student.work_ratings else 50.0  # Base neutral rating
        skill_score = min(len(student.skills) / 40.0, 1.0) * 100.0 # Length of explicit skills proxy
        
        # Calculate Weighted Trust Score
        trust_score = (ai_similarity * 0.5) + (rating_score * 0.25) + (exp_score * 0.15) + (skill_score * 0.10)
        
        student_scores.append({
            "student_id": student.id,
            "candidate_alias": f"Candidate #{str(student.id)[-6:]}",
            "ai_similarity": ai_similarity,
            "skill_score": skill_score,
            "experience_score": exp_score,
            "trust_score": trust_score
        })
        
    # Sort by descending trust score
    student_scores.sort(key=lambda x: x["trust_score"], reverse=True)
    
    # Return top N
    return student_scores[:top_n]
