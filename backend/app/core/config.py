"""
应用配置模块
管理所有环境变量和配置项
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """应用配置类"""
    
    # 应用基本信息
    APP_NAME: str = "AI视频制片链路系统"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # 数据库配置 (Supabase PostgreSQL)
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/ai_video_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis配置 (可选)
    REDIS_URL: Optional[str] = None
    
    # 安全配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # CORS配置 - 使用字符串形式，通过validator解析
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # AI服务API配置
    # 文心一言
    WENXIN_API_KEY: Optional[str] = None
    WENXIN_SECRET_KEY: Optional[str] = None
    
    # 通义千问
    QWEN_API_KEY: Optional[str] = None
    
    # OpenAI (备选)
    OPENAI_API_KEY: Optional[str] = None
    
    # 文件存储配置 (Cloudflare R2)
    R2_ENDPOINT_URL: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: Optional[str] = None
    R2_PUBLIC_URL: Optional[str] = None
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # API配置
    API_V1_STR: str = "/api/v1"
    
    @validator("ALLOWED_ORIGINS", pre=True, always=True)
    def parse_allowed_origins(cls, v):
        """解析允许的来源列表"""
        if isinstance(v, str):
            if not v:
                return ["http://localhost:3000", "http://localhost:5173"]
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# 创建设置实例
settings = Settings()


def get_settings() -> Settings:
    """获取应用配置"""
    return settings
