"""
Redis 服务模块
用于管理 Refresh Token 的白名单机制
"""

import hashlib
from typing import Optional
from datetime import timedelta
import redis
from app.core.config import settings


class RedisService:
    """
    Redis 服务类
    用于管理 Refresh Token 的存储和验证
    """
    
    _instance: Optional['RedisService'] = None
    _client: Optional[redis.Redis] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None and settings.REDIS_URL:
            try:
                self._client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                )
                self._client.ping()
            except (redis.ConnectionError, redis.TimeoutError) as e:
                print(f"Warning: Redis connection failed: {e}")
                self._client = None
    
    @property
    def is_available(self) -> bool:
        """检查 Redis 是否可用"""
        return self._client is not None
    
    def _get_token_key(self, user_id: int, token: str) -> str:
        """
        生成 Token 存储的 Redis key
        使用 token 的 hash 值作为 key 的一部分，避免存储完整 token
        """
        token_hash = hashlib.sha256(token.encode()).hexdigest()[:16]
        return f"refresh_token:{user_id}:{token_hash}"
    
    def store_refresh_token(
        self, 
        user_id: int, 
        token: str, 
        expires_in_days: int = 7
    ) -> bool:
        """
        存储 Refresh Token 到 Redis 白名单
        
        Args:
            user_id: 用户ID
            token: Refresh Token
            expires_in_days: 过期天数
            
        Returns:
            bool: 是否存储成功
        """
        if not self.is_available:
            return False
        
        try:
            key = self._get_token_key(user_id, token)
            expire_seconds = int(timedelta(days=expires_in_days).total_seconds())
            self._client.setex(key, expire_seconds, "1")
            return True
        except (redis.RedisError, Exception) as e:
            print(f"Warning: Failed to store refresh token: {e}")
            return False
    
    def validate_refresh_token(self, user_id: int, token: str) -> bool:
        """
        验证 Refresh Token 是否在白名单中
        
        Args:
            user_id: 用户ID
            token: Refresh Token
            
        Returns:
            bool: Token 是否有效（在白名单中）
        """
        if not self.is_available:
            return True
        
        try:
            key = self._get_token_key(user_id, token)
            return self._client.exists(key) > 0
        except (redis.RedisError, Exception) as e:
            print(f"Warning: Failed to validate refresh token: {e}")
            return True
    
    def revoke_refresh_token(self, user_id: int, token: str) -> bool:
        """
        撤销（删除）Refresh Token
        
        Args:
            user_id: 用户ID
            token: Refresh Token
            
        Returns:
            bool: 是否删除成功
        """
        if not self.is_available:
            return False
        
        try:
            key = self._get_token_key(user_id, token)
            self._client.delete(key)
            return True
        except (redis.RedisError, Exception) as e:
            print(f"Warning: Failed to revoke refresh token: {e}")
            return False
    
    def revoke_all_user_tokens(self, user_id: int) -> bool:
        """
        撤销用户的所有 Refresh Token（用于强制登出所有设备）
        
        Args:
            user_id: 用户ID
            
        Returns:
            bool: 是否删除成功
        """
        if not self.is_available:
            return False
        
        try:
            pattern = f"refresh_token:{user_id}:*"
            keys = self._client.keys(pattern)
            if keys:
                self._client.delete(*keys)
            return True
        except (redis.RedisError, Exception) as e:
            print(f"Warning: Failed to revoke all user tokens: {e}")
            return False


redis_service = RedisService()
