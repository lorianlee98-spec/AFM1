from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ScriptBase(BaseModel):
    """剧本基础模型"""
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    genre: Optional[str] = None
    target_audience: Optional[str] = None
    duration: int = 5
    status: str = "draft"


class ScriptCreate(ScriptBase):
    """创建剧本模型"""
    pass


class ScriptUpdate(BaseModel):
    """更新剧本模型"""
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    genre: Optional[str] = None
    target_audience: Optional[str] = None
    duration: Optional[int] = None
    status: Optional[str] = None


class ScriptInDB(ScriptBase):
    """数据库中的剧本模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScriptResponse(ScriptInDB):
    """剧本响应模型"""
    pass
