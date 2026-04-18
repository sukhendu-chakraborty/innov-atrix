from pydantic import BaseModel
from typing import List, Optional

# Database-Agnostic Match Request Schemas
class StudentProfileInput(BaseModel):
    id: str
    skills: str
    description: str
    pastExperiences: str
    work_ratings: float = 0.0
    experience_years: float = 0.0

class MatchRequest(BaseModel):
    bounty_description: str
    students: List[StudentProfileInput]

class MatchResult(BaseModel):
    student_id: str
    candidate_alias: str
    ai_similarity: float
    skill_score: float
    experience_score: float
    trust_score: float
