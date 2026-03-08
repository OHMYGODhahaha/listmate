from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.generate import router as generate_router
from routes.qa import router as qa_router

load_dotenv()

app = FastAPI(title="ListMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router, prefix="/api")
app.include_router(qa_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}
