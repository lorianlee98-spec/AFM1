from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Script(Base):
    """剧本模型"""
    __tablename__ = "scripts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)  # 剧本内容
    genre = Column(String(50), nullable=True)  # 类型
    target_audience = Column(String(100), nullable=True)  # 目标受众
    duration = Column(Integer, default=5)  # 目标时长（分钟）
    status = Column(String(20), default="draft")  # draft, generating, completed
    
    # 外键关联到用户
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="scripts")
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Script {self.title}>"
