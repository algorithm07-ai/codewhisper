# docker-start.ps1
# InstantCoder MVP Docker开发环境启动脚本

Write-Host "正在启动InstantCoder MVP Docker开发环境..." -ForegroundColor Cyan

# 确保镜像是最新的
Write-Host "构建Docker镜像..." -ForegroundColor Yellow
docker-compose build

# 启动容器
Write-Host "启动Docker容器..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "等待服务启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 显示容器状态
docker ps --filter "name=instantcoder-container"

Write-Host "`nInstantCoder MVP已启动!" -ForegroundColor Green
Write-Host "访问地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n可用命令:" -ForegroundColor Cyan
Write-Host "  查看日志: docker-compose logs -f" -ForegroundColor White
Write-Host "  停止服务: docker-compose down" -ForegroundColor White
Write-Host "  进入容器: docker exec -it instantcoder-container sh" -ForegroundColor White
