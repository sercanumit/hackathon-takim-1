from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from app.routers import auth

app = FastAPI(
    title="Hackathon Takım-1",
    description="Çocukların kararlarına göre eğitici hikayeler oluşturma uygulaması",
    version="0.0.1",
)

app.include_router(auth.router)

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")