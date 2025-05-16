# InstantCoder Docker启动脚本
Write-Host "正在准备启动InstantCoder MVP..." -ForegroundColor Cyan

# 创建.env.local文件
Write-Host "配置环境变量..." -ForegroundColor Yellow
"DEEPSEEK_API_KEY=sk-b56dee9d550248d796ec90c32f3e5612" | Out-File -FilePath .env.local -Encoding utf8
"NEXT_PUBLIC_APP_URL=http://localhost:3000" | Out-File -FilePath .env.local -Append -Encoding utf8

Write-Host "环境变量已配置完成" -ForegroundColor Green

# 检查Docker是否运行
try {
    $dockerStatus = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: Docker似乎没有运行。请确保Docker Desktop已启动后再试。" -ForegroundColor Red
        Write-Host "按任意键退出..."
        $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
        exit
    }
} catch {
    Write-Host "错误: 无法运行Docker命令。请确保Docker已正确安装。" -ForegroundColor Red
    Write-Host "按任意键退出..."
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
    exit
}

# 启动Docker容器
Write-Host "正在启动Docker环境..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nInstantCoder MVP已启动!" -ForegroundColor Green
    Write-Host "访问地址: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`n可用命令:" -ForegroundColor Cyan
    Write-Host "  查看日志: docker-compose logs -f" -ForegroundColor White
    Write-Host "  停止服务: docker-compose down" -ForegroundColor White
    Write-Host "  进入容器: docker exec -it instantcoder-container sh" -ForegroundColor White
} else {
    Write-Host "`n启动Docker容器失败，请检查错误信息" -ForegroundColor Red
}

Write-Host "`n按任意键继续..."
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
