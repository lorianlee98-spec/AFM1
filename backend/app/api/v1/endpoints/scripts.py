from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.script import script as crud_script
from app.models.user import User
from app.schemas.script import ScriptCreate, ScriptUpdate, ScriptResponse

router = APIRouter()


@router.get("/", response_model=List[ScriptResponse])
def list_scripts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    获取当前用户的所有剧本
    """
    scripts = crud_script.get_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return scripts


@router.post("/", response_model=ScriptResponse, status_code=status.HTTP_201_CREATED)
def create_script(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    script_in: ScriptCreate,
) -> Any:
    """
    创建新剧本
    """
    # 检查是否已存在同名剧本
    existing = crud_script.get_by_title(
        db, user_id=current_user.id, title=script_in.title
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Script with this title already exists",
        )
    
    script = crud_script.create_with_user(
        db, obj_in=script_in, user_id=current_user.id
    )
    return script


@router.get("/{script_id}", response_model=ScriptResponse)
def get_script(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    script_id: int,
) -> Any:
    """
    获取指定剧本的详细信息
    """
    script = crud_script.get(db, id=script_id)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Script not found",
        )
    if script.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return script


@router.put("/{script_id}", response_model=ScriptResponse)
def update_script(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    script_id: int,
    script_in: ScriptUpdate,
) -> Any:
    """
    更新剧本信息
    """
    script = crud_script.get(db, id=script_id)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Script not found",
        )
    if script.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # 如果更新标题，检查是否与其他剧本冲突
    if script_in.title and script_in.title != script.title:
        existing = crud_script.get_by_title(
            db, user_id=current_user.id, title=script_in.title
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Script with this title already exists",
            )
    
    script = crud_script.update(db, db_obj=script, obj_in=script_in)
    return script


@router.delete("/{script_id}", response_model=ScriptResponse)
def delete_script(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    script_id: int,
) -> Any:
    """
    删除剧本
    """
    script = crud_script.get(db, id=script_id)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Script not found",
        )
    if script.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    script = crud_script.remove(db, id=script_id)
    return script


@router.patch("/{script_id}/content", response_model=ScriptResponse)
def update_script_content(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    script_id: int,
    content: str,
) -> Any:
    """
    更新剧本内容
    """
    script = crud_script.get(db, id=script_id)
    if not script:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Script not found",
        )
    if script.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    script = crud_script.update_content(db, db_obj=script, content=content)
    return script
