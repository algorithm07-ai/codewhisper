@echo off
echo 正在准备启动InstantCoder MVP...

REM 创建.env.local文件
echo DEEPSEEK_API_KEY=sk-b56dee9d550248d796ec90c32f3e5612 > .env.local
echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local

echo 环境变量已配置完成

REM 启动Docker容器
echo 正在启动Docker环境...
docker-compose up -d

echo.
echo InstantCoder MVP已启动!
echo 访问地址: http://localhost:3000
echo.
echo 可用命令:
echo   查看日志: docker-compose logs -f
echo   停止服务: docker-compose down
echo   进入容器: docker exec -it instantcoder-container sh

pause
