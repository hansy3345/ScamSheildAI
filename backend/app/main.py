import os
import sys
import uuid
from typing import Optional, List
from datetime import datetime

# Ensure project root is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete

from app.models.schemas import AnalysisResultSchema
from app.services.gemini_service import GeminiService
from app.database.database import init_db, get_db, ScanRecord

app = FastAPI(
    title="ScamShield AI Intelligence API",
    description="Multimodal Autonomous Multi-Agent Cyber Fraud & Scam Detection Engine",
    version="2.0.0"
)

# Configure CORS
origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,https://scamshield-ai.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_service = GeminiService()

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "ScamShield AI",
        "version": "2.0.0",
        "gemini_active": bool(gemini_service.client),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/analyze", response_model=AnalysisResultSchema)
async def analyze_endpoint(
    input_type: str = Form(...),
    content: str = Form(...),
    url: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Main Multimodal Analysis Endpoint:
    Accepts text payloads and optional screenshot files.
    Dispatches to 6-agent Gemini 2.0 Flash pipeline and stores scan records.
    """
    image_bytes = None
    if file:
        image_bytes = await file.read()

    # Run AI Analysis
    result = await gemini_service.analyze_multimodal(
        content=content,
        input_type=input_type,
        image_bytes=image_bytes,
        language=language
    )

    # Persist to Database
    try:
        record = ScanRecord(
            id=result["id"],
            input_type=input_type,
            input_preview=content[:200],
            risk_score=result["riskScore"],
            risk_level=result["riskLevel"],
            scam_category=result["scamCategory"],
            category_label=result["categoryLabel"],
            summary=result["summary"],
            explanation=result["explanation"],
            full_result=result,
            language=language
        )
        db.add(record)
        await db.commit()
    except Exception as e:
        print(f"[Database] Warning: Could not persist scan record: {e}")

    return result

@app.get("/api/history")
async def get_history_endpoint(
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Fetch stored scan records from database"""
    result = await db.execute(
        select(ScanRecord).order_by(desc(ScanRecord.created_at)).limit(limit)
    )
    records = result.scalars().all()
    return [
        {
            "id": r.id,
            "inputType": r.input_type,
            "inputPreview": r.input_preview,
            "result": r.full_result,
            "timestamp": r.created_at.isoformat() if r.created_at else datetime.utcnow().isoformat()
        }
        for r in records
    ]

@app.delete("/api/history/{record_id}")
async def delete_history_item(
    record_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a single scan record"""
    await db.execute(delete(ScanRecord).where(ScanRecord.id == record_id))
    await db.commit()
    return {"success": True, "deleted_id": record_id}

@app.delete("/api/history")
async def clear_all_history(
    db: AsyncSession = Depends(get_db)
):
    """Clear all scan history"""
    await db.execute(delete(ScanRecord))
    await db.commit()
    return {"success": True, "message": "History cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
