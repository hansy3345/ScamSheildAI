from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RiskFactor(BaseModel):
    label: str
    severity: int = Field(..., ge=0, le=100)
    description: str

class EvidenceItem(BaseModel):
    type: str # 'url' | 'text' | 'pattern' | 'metadata' | 'behavioral'
    title: str
    detail: str
    severity: str # 'safe' | 'suspicious' | 'high-risk' | 'critical'

class ActionItem(BaseModel):
    icon: str
    text: str
    priority: str # 'high' | 'medium' | 'low'

class AnalysisResultSchema(BaseModel):
    id: str
    riskScore: int = Field(..., ge=0, le=100)
    riskLevel: str
    scamCategory: str
    categoryLabel: str
    explanation: str
    riskFactors: List[RiskFactor]
    evidence: List[EvidenceItem]
    recommendedActions: List[ActionItem]
    avoidActions: List[ActionItem]
    confidence: int = Field(..., ge=0, le=100)
    summary: str
    detailedAnalysis: str
    timestamp: str

class AnalysisRequestSchema(BaseModel):
    inputType: str # 'message' | 'screenshot' | 'url' | 'email' | 'job-offer' | 'other'
    content: str
    url: Optional[str] = None
    language: Optional[str] = "en"
