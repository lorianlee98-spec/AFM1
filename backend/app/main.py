"""
FastAPI 应用主入口
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    启动时执行初始化，关闭时执行清理
    """
    # 启动时执行
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 启动中...")
    
    # 这里可以添加数据库连接、缓存初始化等
    
    yield
    
    # 关闭时执行
    print(f"👋 {settings.APP_NAME} 正在关闭...")
    
    # 这里可以添加资源清理


# 创建FastAPI应用实例
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI驱动的视频制作平台后端API",
    lifespan=lifespan,
    docs_url="/docs",  # API文档地址
    redoc_url="/redoc",  # 替代API文档
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径 - 服务状态检查"""
    return {
        "message": f"欢迎使用{settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "status": "running",
        "docs_url": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION
    }


@app.get("/api/v1/status")
async def api_status():
    """API状态信息"""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": "production" if not settings.DEBUG else "development",
        "features": [
            "剧本创作",
            "分镜制作",
            "人设制作",
            "音频生成",
            "视频生成",
            "成片输出"
        ]
    }


# 错误处理
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """全局异常处理"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.DEBUG else "服务器内部错误"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
