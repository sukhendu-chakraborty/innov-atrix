from fastapi import FastAPI
from typing import List
import schemas

app = FastAPI(title="STEP-A-HEAD AI Microservice")

@app.post("/api/match_internal", response_model=List[schemas.MatchResult])
def match_internal(request: schemas.MatchRequest):
    from ai.matcher import find_best_students
    results = find_best_students(request.bounty_description, request.students)
    return results
