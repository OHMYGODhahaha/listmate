from fastapi import APIRouter
router = APIRouter()

@router.post("/generate")
async def generate_listing():
    return {"message": "generate placeholder"}
