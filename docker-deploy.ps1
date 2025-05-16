# docker-deploy.ps1
# InstantCoder MVP Docker生产环境部署脚本

Write-Host "开始部署InstantCoder MVP到生产环境..." -ForegroundColor Cyan

# 切换到生产模式
$env:NODE_ENV = "production"

# 构建生产镜像
Write-Host "构建生产镜像..." -ForegroundColor Yellow
docker build -t instantcoder-production:latest --target runner .

# 检查是否已有运行的生产容器
$runningContainer = docker ps -q --filter "name=instantcoder-production"
if ($runningContainer) {
    Write-Host "停止并移除现有的生产容器..." -ForegroundColor Yellow
    docker stop instantcoder-production
    docker rm instantcoder-production
}

# 运行生产容器
Write-Host "启动生产容器..." -ForegroundColor Yellow
docker run -d --name instantcoder-production -p 3000:3000 -e NODE_ENV=production -e DEEPSEEK_API_KEY=$env:DEEPSEEK_API_KEY instantcoder-production:latest

Write-Host "`nInstantCoder MVP已成功部署!" -ForegroundColor Green
Write-Host "生产环境访问地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n可用命令:" -ForegroundColor Cyan
Write-Host "  查看日志: docker logs -f instantcoder-production" -ForegroundColor White
Write-Host "  停止服务: docker stop instantcoder-production" -ForegroundColor White
