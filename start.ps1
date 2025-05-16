# 简单版启动脚本
Write-Host "正在配置环境变量..."
Set-Content -Path .env.local -Value "DEEPSEEK_API_KEY=sk-b56dee9d550248d796ec90c32f3e5612"
Add-Content -Path .env.local -Value "NEXT_PUBLIC_APP_URL=http://localhost:3000"

Write-Host "正在启动Docker环境..."
docker-compose up -d

Write-Host "操作完成"
Write-Host "访问地址: http://localhost:3000"
