from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="Nutrition AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://35.227.120.41"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "ok"}
