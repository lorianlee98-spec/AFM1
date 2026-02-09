from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.script import Script
from app.schemas.script import ScriptCreate, ScriptUpdate


class CRUDScript(CRUDBase[Script, ScriptCreate, ScriptUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Script]:
        """获取用户的所有剧本"""
        return (
            db.query(Script)
            .filter(Script.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_title(
        self, db: Session, *, user_id: int, title: str
    ) -> Optional[Script]:
        """根据标题获取剧本"""
        return (
            db.query(Script)
            .filter(Script.user_id == user_id, Script.title == title)
            .first()
        )

    def create_with_user(
        self, db: Session, *, obj_in: ScriptCreate, user_id: int
    ) -> Script:
        """创建剧本并关联用户"""
        db_obj = Script(
            title=obj_in.title,
            description=obj_in.description,
            content=obj_in.content,
            genre=obj_in.genre,
            target_audience=obj_in.target_audience,
            duration=obj_in.duration,
            status=obj_in.status,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_content(
        self, db: Session, *, db_obj: Script, content: str
    ) -> Script:
        """更新剧本内容"""
        db_obj.content = content
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


script = CRUDScript(Script)
