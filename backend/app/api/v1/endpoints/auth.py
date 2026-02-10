from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.core.redis_service import redis_service
from app.schemas.token import Token, TokenRefresh
from app.schemas.user import UserCreate, UserResponse
from app.crud.user import user as crud_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    用户注册
    """
    # 检查邮箱是否已存在
    if crud_user.get_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # 检查用户名是否已存在
    if crud_user.get_by_username(db, username=user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    
    user = crud_user.create(db, obj_in=user_in)
    return user


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    用户登录 (OAuth2 compatible)
    
    登录成功后：
    1. 生成 access_token 和 refresh_token
    2. 将 refresh_token 存入 Redis 白名单（如果 Redis 可用）
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    redis_service.store_refresh_token(
        user_id=user.id,
        token=refresh_token,
        expires_in_days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.post("/refresh", response_model=Token)
def refresh_token(
    refresh_token: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    刷新访问令牌
    
    验证流程：
    1. 解码并验证 token 类型和有效期
    2. 检查 token 是否在 Redis 白名单中（如果 Redis 可用）
    3. 验证用户状态
    4. 生成新的 token 对，并更新白名单
    """
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = int(payload.get("sub"))
    
    if not redis_service.validate_refresh_token(user_id, refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )
    
    user = crud_user.get(db, id=user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    redis_service.revoke_refresh_token(user_id, refresh_token)
    
    access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    
    redis_service.store_refresh_token(
        user_id=user.id,
        token=new_refresh_token,
        expires_in_days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(
    refresh_token: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    用户登出
    
    从 Redis 白名单中移除 refresh_token，使其失效
    注意：access_token 仍在其有效期内有效，直到过期
    """
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token",
        )
    
    user_id = int(payload.get("sub"))
    
    redis_service.revoke_refresh_token(user_id, refresh_token)
    
    return {"message": "Successfully logged out"}


@router.post("/logout-all", status_code=status.HTTP_200_OK)
def logout_all_devices(
    current_user: Any = Depends(deps.get_current_user),
) -> Any:
    """
    登出所有设备
    
    撤销当前用户的所有 refresh_token，强制所有设备重新登录
    """
    redis_service.revoke_all_user_tokens(current_user.id)
    
    return {"message": "Successfully logged out from all devices"}
