from fastapi import APIRouter
router = APIRouter()

@router.post("/qa")
async def run_qa():
    return {"message": "qa placeholder"}
