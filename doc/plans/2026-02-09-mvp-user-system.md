# MVP用户系统实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现完整的用户认证系统，包括注册、登录、JWT令牌管理和用户资料管理

**Architecture:** 使用FastAPI + SQLAlchemy + SQLite (本地开发) / PostgreSQL (生产)，JWT进行无状态认证，密码使用bcrypt加密

**Tech Stack:** FastAPI, SQLAlchemy, Pydantic, python-jose, passlib, bcrypt

---

## Task 1: 创建用户数据模型

**Files:**
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/db/base.py`

**Step 1: 编写基础模型基类**

```python
# backend/app/db/base.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Step 2: 编写用户模型**

```python
# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
```

**Step 3: 更新模型__init__.py**

```python
# backend/app/models/__init__.py
from app.models.user import User

__all__ = ["User"]
```

**Step 4: 运行测试验证模型**

Run: `cd backend && source venv/bin/activate && python -c "from app.models.user import User; print('User model imported successfully')"`

Expected: `User model imported successfully`

**Step 5: Commit**

```bash
git add backend/app/models/ backend/app/db/
git commit -m "feat: add User model with SQLAlchemy

- Create base SQLAlchemy configuration
- Add User model with all required fields
- Include email, username, password hashing support
- Add timestamps and user profile fields"
```

---

## Task 2: 创建数据库迁移

**Files:**
- Modify: `backend/alembic/env.py`
- Run: alembic commands

**Step 1: 更新Alembic环境配置**

```python
# backend/alembic/env.py (更新target_metadata)
from app.db.base import Base
from app.models import User

target_metadata = Base.metadata
```

**Step 2: 创建初始迁移脚本**

Run: `cd backend && source venv/bin/activate && alembic revision --autogenerate -m "create users table"`

Expected: 生成迁移文件在 `backend/alembic/versions/`

**Step 3: 应用迁移**

Run: `alembic upgrade head`

Expected: `INFO  [alembic.runtime.migration] Context impl SQLiteImpl. INFO  [alembic.runtime.migration] Will assume non-transactional DDL. INFO  [alembic.runtime.migration] Running upgrade  -> xxxx, create users table`

**Step 4: 验证数据库表**

Run: `sqlite3 backend/ai_video.db ".schema users"`

Expected: 显示users表的完整schema

**Step 5: Commit**

```bash
git add backend/alembic/
git commit -m "feat: add database migration for users table

- Configure Alembic with User model
- Create initial migration script
- Apply migration to create users table"
```

---

## Task 3: 创建Pydantic Schema

**Files:**
- Create: `backend/app/schemas/user.py`
- Create: `backend/app/schemas/__init__.py`
- Create: `backend/app/schemas/token.py`

**Step 1: 创建用户Schema**

```python
# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserResponse(UserInDB):
    pass


class UserLogin(BaseModel):
    email: EmailStr
    password: str
```

**Step 2: 创建Token Schema**

```python
# backend/app/schemas/token.py
from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str
```

**Step 3: 更新__init__.py**

```python
# backend/app/schemas/__init__.py
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserInDB, UserResponse, UserLogin
from app.schemas.token import Token, TokenPayload, RefreshTokenRequest

__all__ = [
    "UserBase", "UserCreate", "UserUpdate", "UserInDB", "UserResponse", "UserLogin",
    "Token", "TokenPayload", "RefreshTokenRequest"
]
```

**Step 4: 验证Schema**

Run: `cd backend && source venv/bin/activate && python -c "from app.schemas import UserCreate; u = UserCreate(email='test@example.com', username='test', password='password123'); print(u)"`

Expected: 成功创建UserCreate实例

**Step 5: Commit**

```bash
git add backend/app/schemas/
git commit -m "feat: add Pydantic schemas for user and token

- Create UserBase, UserCreate, UserUpdate schemas
- Create UserInDB and UserResponse schemas
- Create Token and TokenPayload schemas
- Add validation rules for email and password"
```

---

## Task 4: 实现密码哈希工具

**Files:**
- Create: `backend/app/core/security.py`

**Step 1: 编写安全工具函数**

```python
# backend/app/core/security.py
from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    return pwd_context.hash(password)


def create_access_token(subject: Union[str, int], expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: Union[str, int]) -> str:
    """创建刷新令牌"""
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """解码令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

**Step 2: 编写测试**

```python
# backend/tests/test_security.py
import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_password_hash():
    password = "testpassword123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_access_token():
    user_id = "123"
    token = create_access_token(user_id)
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["type"] == "access"
```

**Step 3: 运行测试**

Run: `cd backend && source venv/bin/activate && pytest tests/test_security.py -v`

Expected: 2 tests passed

**Step 4: Commit**

```bash
git add backend/app/core/security.py backend/tests/test_security.py
git commit -m "feat: add security utilities for password and JWT

- Implement bcrypt password hashing
- Create JWT access and refresh token functions
- Add token decode functionality
- Add comprehensive tests"
```

---

## Task 5: 创建用户CRUD操作

**Files:**
- Create: `backend/app/crud/user.py`
- Create: `backend/app/crud/__init__.py`
- Create: `backend/app/crud/base.py`

**Step 1: 创建基础CRUD类**

```python
# backend/app/crud/base.py
from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy.orm import Session
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
```

**Step 2: 创建用户CRUD**

```python
# backend/app/crud/user.py
from typing import Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active


user = CRUDUser(User)
```

**Step 3: 更新__init__.py**

```python
# backend/app/crud/__init__.py
from app.crud.user import user

__all__ = ["user"]
```

**Step 4: Commit**

```bash
git add backend/app/crud/
git commit -m "feat: add CRUD operations for user

- Create base CRUD class with generic types
- Implement user-specific CRUD operations
- Add email/username lookup methods
- Implement authentication method"
```

---

## Task 6: 实现认证依赖

**Files:**
- Create: `backend/app/api/deps.py`

**Step 1: 编写认证依赖**

```python
# backend/app/api/deps.py
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from app.core.config import settings
from app.core.security import decode_token
from app.db.base import SessionLocal
from app.models.user import User
from app.schemas.token import TokenPayload
from app.crud.user import user as crud_user

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    token_data = TokenPayload(**payload)
    if token_data.sub is None:
        raise credentials_exception
    
    current_user = crud_user.get(db, id=int(token_data.sub))
    if current_user is None:
        raise credentials_exception
    
    return current_user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not crud_user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user
```

**Step 2: 添加API路由前缀配置**

```python
# backend/app/core/config.py (添加)
API_V1_STR: str = "/api/v1"
```

**Step 3: Commit**

```bash
git add backend/app/api/deps.py
git commit -m "feat: add authentication dependencies

- Implement OAuth2 password bearer scheme
- Create get_current_user dependency
- Add get_current_active_user dependency
- Add superuser check dependency"
```

---

## Task 7: 创建认证API端点

**Files:**
- Create: `backend/app/api/v1/endpoints/auth.py`
- Create: `backend/app/api/v1/endpoints/__init__.py`
- Create: `backend/app/api/v1/__init__.py`
- Create: `backend/app/api/v1/api.py`

**Step 1: 创建认证端点**

```python
# backend/app/api/v1/endpoints/auth.py
from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.schemas.token import Token
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
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.post("/refresh", response_model=Token)
def refresh_token(
    db: Session = Depends(deps.get_db),
    refresh_token: str,
) -> Any:
    """
    刷新访问令牌
    """
    from app.core.security import decode_token
    
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = int(payload.get("sub"))
    user = crud_user.get(db, id=user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }
```

**Step 2: 创建API路由聚合**

```python
# backend/app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
```

**Step 3: 更新主应用**

```python
# backend/app/main.py (添加路由)
from app.api.v1.api import api_router
from app.core.config import settings

# ... 其他代码 ...

app.include_router(api_router, prefix=settings.API_V1_STR)
```

**Step 4: 测试API**

Run: `curl -X POST "http://localhost:8000/api/v1/auth/register" -H "Content-Type: application/json" -d '{"email":"test@example.com","username":"testuser","password":"password123"}'`

Expected: 返回用户数据

**Step 5: Commit**

```bash
git add backend/app/api/
git commit -m "feat: add authentication API endpoints

- Implement user registration endpoint
- Implement OAuth2 login endpoint
- Add token refresh endpoint
- Include email/username validation"
```

---

## Task 8: 创建用户资料API

**Files:**
- Create: `backend/app/api/v1/endpoints/users.py`

**Step 1: 创建用户端点**

```python
# backend/app/api/v1/endpoints/users.py
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.crud.user import user as crud_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    获取当前用户信息
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    更新当前用户信息
    """
    user = crud_user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=UserResponse)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    通过ID获取用户信息
    """
    user = crud_user.get(db, id=user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return user
```

**Step 2: 更新API路由**

```python
# backend/app/api/v1/api.py
from app.api.v1.endpoints import auth, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
```

**Step 3: 测试API**

Run: `curl -H "Authorization: Bearer <access_token>" http://localhost:8000/api/v1/users/me`

Expected: 返回当前用户信息

**Step 4: Commit**

```bash
git add backend/app/api/v1/
git commit -m "feat: add user profile API endpoints

- Add get current user endpoint
- Add update current user endpoint
- Add get user by ID endpoint (admin only for other users)"
```

---

## Summary

**已完成的功能:**
1. ✅ 用户数据模型 (User model)
2. ✅ 数据库迁移 (Alembic)
3. ✅ Pydantic Schema (User/Token schemas)
4. ✅ 密码和JWT安全工具
5. ✅ 用户CRUD操作
6. ✅ 认证依赖 (OAuth2)
7. ✅ 认证API (注册/登录/刷新)
8. ✅ 用户资料API

**API端点:**
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新令牌
- `GET /api/v1/users/me` - 获取当前用户
- `PUT /api/v1/users/me` - 更新当前用户
- `GET /api/v1/users/{id}` - 获取用户详情

**下一步:**
- 实现剧本创作模块
- 添加前端登录/注册页面
- 集成测试
