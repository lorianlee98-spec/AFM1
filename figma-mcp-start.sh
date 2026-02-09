#!/bin/bash

# Figma MCP Server 启动脚本
# 使用方法: ./figma-mcp-start.sh YOUR_FIGMA_TOKEN

FIGMA_TOKEN=$1

if [ -z "$FIGMA_TOKEN" ]; then
    echo "❌ 错误: 请提供 Figma Access Token"
    echo "使用方法: ./figma-mcp-start.sh YOUR_FIGMA_TOKEN"
    echo ""
    echo "获取 Token 步骤:"
    echo "1. 登录 Figma → Settings → Personal access tokens"
    echo "2. 点击 Create new token"
    echo "3. 复制令牌并粘贴到命令中"
    exit 1
fi

echo "🚀 正在启动 Figma MCP Server..."
echo "📌 Token: ${FIGMA_TOKEN:0:10}..."
echo ""

# 使用 npx 运行 MCP 服务器
npx -y figma-developer-mcp --figma-api-key="$FIGMA_TOKEN" --stdio
