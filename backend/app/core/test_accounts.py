"""
测试账号管理模块
提供预置的测试账号，方便开发和测试使用
"""

from typing import Dict, List, Optional
from pydantic import BaseModel
from enum import Enum


class TestAccountRole(str, Enum):
    """测试账号角色"""
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"


class TestAccount(BaseModel):
    """测试账号模型"""
    email: str
    username: str
    password: str
    role: TestAccountRole
    description: str


# 预置测试账号列表
TEST_ACCOUNTS: List[TestAccount] = [
    TestAccount(
        email="test@afm.io",
        username="testuser",
        password="Test123456!",
        role=TestAccountRole.USER,
        description="普通测试用户 - 拥有完整功能权限"
    ),
    TestAccount(
        email="admin@afm.io",
        username="adminuser",
        password="Admin123456!",
        role=TestAccountRole.ADMIN,
        description="管理员测试账号 - 拥有所有管理权限"
    ),
    TestAccount(
        email="guest@afm.io",
        username="guestuser",
        password="Guest123456!",
        role=TestAccountRole.GUEST,
        description="访客测试账号 - 仅查看权限"
    ),
]


class TestAccountManager:
    """测试账号管理器"""
    
    @staticmethod
    def get_all_accounts() -> List[TestAccount]:
        """获取所有测试账号"""
        return TEST_ACCOUNTS
    
    @staticmethod
    def get_account_by_email(email: str) -> Optional[TestAccount]:
        """通过邮箱获取测试账号"""
        for account in TEST_ACCOUNTS:
            if account.email == email:
                return account
        return None
    
    @staticmethod
    def verify_credentials(email: str, password: str) -> Optional[TestAccount]:
        """验证测试账号凭据"""
        account = TestAccountManager.get_account_by_email(email)
        if account and account.password == password:
            return account
        return None
    
    @staticmethod
    def get_accounts_by_role(role: TestAccountRole) -> List[TestAccount]:
        """获取特定角色的测试账号"""
        return [acc for acc in TEST_ACCOUNTS if acc.role == role]
    
    @staticmethod
    def is_test_account(email: str) -> bool:
        """检查是否为测试账号"""
        return TestAccountManager.get_account_by_email(email) is not None


# 全局测试账号管理器实例
test_account_manager = TestAccountManager()
