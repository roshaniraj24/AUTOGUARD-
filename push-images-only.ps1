# Push AutoGuard Images to Docker Hub
# Images are already built, this script just pushes them

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        AutoGuard - Push to Docker Hub (Images Built!)         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "Step 1: Login to Docker Hub" -ForegroundColor Yellow
Write-Host "Username: roshani24" -ForegroundColor White
Write-Host ""
docker login -u roshani24

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker login failed! Please check your password." -ForegroundColor Red
    Write-Host "Tip: Create a Personal Access Token at https://app.docker.com/settings" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Successfully logged in to Docker Hub!" -ForegroundColor Green
Write-Host ""

# Step 2: Push all images
Write-Host "Step 2: Pushing 8 images to Docker Hub..." -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 [1/8] Pushing autoguard-backend:latest..." -ForegroundColor Cyan
docker push roshani24/autoguard-backend:latest
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [2/8] Pushing autoguard-backend:v1.0..." -ForegroundColor Cyan
docker push roshani24/autoguard-backend:v1.0
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [3/8] Pushing autoguard-frontend:latest..." -ForegroundColor Cyan
docker push roshani24/autoguard-frontend:latest
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [4/8] Pushing autoguard-frontend:v1.0..." -ForegroundColor Cyan
docker push roshani24/autoguard-frontend:v1.0
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [5/8] Pushing autoguard-nagios:latest..." -ForegroundColor Cyan
docker push roshani24/autoguard-nagios:latest
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [6/8] Pushing autoguard-nagios:v1.0..." -ForegroundColor Cyan
docker push roshani24/autoguard-nagios:v1.0
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [7/8] Pushing autoguard-ansible:latest..." -ForegroundColor Cyan
docker push roshani24/autoguard-ansible:latest
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 [8/8] Pushing autoguard-ansible:v1.0..." -ForegroundColor Cyan
docker push roshani24/autoguard-ansible:v1.0
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""

# Success summary
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          🎉 ALL IMAGES PUSHED SUCCESSFULLY! 🎉                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Your images are now live on Docker Hub!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 View Your Repositories:" -ForegroundColor Cyan
Write-Host "  • Profile: https://hub.docker.com/u/roshani24" -ForegroundColor White
Write-Host ""
Write-Host "  • Backend:  https://hub.docker.com/r/roshani24/autoguard-backend" -ForegroundColor White
Write-Host "  • Frontend: https://hub.docker.com/r/roshani24/autoguard-frontend" -ForegroundColor White
Write-Host "  • Nagios:   https://hub.docker.com/r/roshani24/autoguard-nagios" -ForegroundColor White
Write-Host "  • Ansible:  https://hub.docker.com/r/roshani24/autoguard-ansible" -ForegroundColor White
Write-Host ""
Write-Host "🎓 Ready to show your ma'am!" -ForegroundColor Green
Write-Host ""
Write-Host "Anyone can now pull your images:" -ForegroundColor Yellow
Write-Host "  docker pull roshani24/autoguard-backend:latest" -ForegroundColor Gray
Write-Host "  docker pull roshani24/autoguard-frontend:latest" -ForegroundColor Gray
Write-Host "  docker pull roshani24/autoguard-nagios:latest" -ForegroundColor Gray
Write-Host "  docker pull roshani24/autoguard-ansible:latest" -ForegroundColor Gray
Write-Host ""
