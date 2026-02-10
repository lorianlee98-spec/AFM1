import re
from typing import Any, List, Dict, Optional
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


@router.post("/optimize/prompt")
def optimize_prompt(
    *, 
    prompt: str,
    current_user: User = Depends(deps.get_current_user)
) -> Dict[str, List[str]]:
    """
    优化剧本生成提示词
    """
    if not prompt or len(prompt.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    # 生成优化建议
    suggestions = [
        f"{prompt}，包含详细的角色设定和情感冲突",
        f"{prompt}，突出视觉效果和画面感",
        f"{prompt}，加入意想不到的剧情转折",
        f"{prompt}，注重对话的自然流畅和个性化",
        f"{prompt}，营造特定的氛围和情绪基调"
    ]
    
    return {"suggestions": suggestions}


@router.post("/optimize/content")
def optimize_content(
    *, 
    content: str,
    script_id: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    优化剧本内容
    """
    if not content or len(content.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content cannot be empty"
        )
    
    # 获取剧本信息（如果提供了script_id）
    script = None
    if script_id:
        script = crud_script.get(db, id=script_id)
        if not script:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Script not found"
            )
        if script.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    
    suggestions = []
    
    # 结构优化建议
    if "=== 场景" not in content:
        suggestions.append({
            "type": "structure",
            "title": "剧本结构优化",
            "description": "建议按照标准剧本结构组织内容",
            "suggestion": f"{script.title if script else '剧本'}\n\n类型：{script.genre if script else '剧情'}\n目标时长：{script.duration if script else 5}分钟\n\n=== 场景1：开头 ===\n\n[画面描述]\n{content}\n\n=== 场景2：发展 ===\n\n[画面描述]\n...\n\n=== 场景3：高潮 ===\n\n[画面描述]\n...\n\n=== 场景4：结局 ===\n\n[画面描述]\n...\n\n=== 完 ==="
        })
    
    # 对话优化建议
    if "：（" not in content:
        suggestions.append({
            "type": "dialogue",
            "title": "对话格式优化",
            "description": "建议使用标准对话格式",
            "suggestion": re.sub(r"([^：]+)：([^\n]+)", r"$1：（$2）", content)
        })
    
    # 描述优化建议
    if "[画面描述]" not in content:
        suggestions.append({
            "type": "description",
            "title": "画面描述增强",
            "description": "建议添加详细的画面描述",
            "suggestion": re.sub(r"=== 场景[^=]+===", r"$&\n\n[画面描述]\n镜头推进，展示场景细节...", content)
        })
    
    # 角色优化建议
    if "主角" not in content or "配角" not in content:
        suggestions.append({
            "type": "character",
            "title": "角色设定完善",
            "description": "建议明确角色设定和关系",
            "suggestion": content.replace("角色A", "主角").replace("角色B", "配角").replace("=== 场景1：开头 ===", "=== 场景1：开头 ===\n\n[角色设定]\n主角：主要人物，性格特点...\n配角：重要配角，与主角的关系...")
        })
    
    return {"suggestions": suggestions}
