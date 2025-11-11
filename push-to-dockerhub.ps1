# AutoGuard - Push Docker Images to Docker Hub
# Username: roshani24

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AutoGuard Docker Hub Upload Script   " -ForegroundColor Cyan
Write-Host "   Username: roshani24                   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Docker Hub
Write-Host "Step 1: Login to Docker Hub" -ForegroundColor Yellow
Write-Host "Please enter your Docker Hub credentials:" -ForegroundColor White
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker login failed! Please check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Successfully logged in to Docker Hub!" -ForegroundColor Green
Write-Host ""

# Step 2: Build all custom images
Write-Host "Step 2: Building Docker Images..." -ForegroundColor Yellow
Write-Host ""

Write-Host "📦 Building AutoGuard Backend..." -ForegroundColor Cyan
docker build -t roshani24/autoguard-backend:latest ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend built successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Building AutoGuard Frontend..." -ForegroundColor Cyan
docker build -t roshani24/autoguard-frontend:latest ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Building AutoGuard Nagios..." -ForegroundColor Cyan
docker build -t roshani24/autoguard-nagios:latest ./monitoring/nagios
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Nagios build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Nagios built successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Building AutoGuard Ansible..." -ForegroundColor Cyan
docker build -t roshani24/autoguard-ansible:latest ./ansible
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ansible build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ansible built successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Tag images with version
Write-Host "Step 3: Tagging images with version v1.0..." -ForegroundColor Yellow
docker tag roshani24/autoguard-backend:latest roshani24/autoguard-backend:v1.0
docker tag roshani24/autoguard-frontend:latest roshani24/autoguard-frontend:v1.0
docker tag roshani24/autoguard-nagios:latest roshani24/autoguard-nagios:v1.0
docker tag roshani24/autoguard-ansible:latest roshani24/autoguard-ansible:v1.0
Write-Host "✅ Images tagged successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Push images to Docker Hub
Write-Host "Step 4: Pushing images to Docker Hub..." -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 Pushing AutoGuard Backend..." -ForegroundColor Cyan
docker push roshani24/autoguard-backend:latest
docker push roshani24/autoguard-backend:v1.0
Write-Host "✅ Backend pushed!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Pushing AutoGuard Frontend..." -ForegroundColor Cyan
docker push roshani24/autoguard-frontend:latest
docker push roshani24/autoguard-frontend:v1.0
Write-Host "✅ Frontend pushed!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Pushing AutoGuard Nagios..." -ForegroundColor Cyan
docker push roshani24/autoguard-nagios:latest
docker push roshani24/autoguard-nagios:v1.0
Write-Host "✅ Nagios pushed!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Pushing AutoGuard Ansible..." -ForegroundColor Cyan
docker push roshani24/autoguard-ansible:latest
docker push roshani24/autoguard-ansible:v1.0
Write-Host "✅ Ansible pushed!" -ForegroundColor Green
Write-Host ""

# Step 5: Summary
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ ALL IMAGES PUSHED SUCCESSFULLY!   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your images are now available at:" -ForegroundColor Yellow
Write-Host "  • https://hub.docker.com/r/roshani24/autoguard-backend" -ForegroundColor Cyan
Write-Host "  • https://hub.docker.com/r/roshani24/autoguard-frontend" -ForegroundColor Cyan
Write-Host "  • https://hub.docker.com/r/roshani24/autoguard-nagios" -ForegroundColor Cyan
Write-Host "  • https://hub.docker.com/r/roshani24/autoguard-ansible" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view all your images, visit:" -ForegroundColor Yellow
Write-Host "  https://hub.docker.com/u/roshani24" -ForegroundColor White
Write-Host ""
Write-Host "Images pushed with tags:" -ForegroundColor Yellow
Write-Host "  • latest (most recent version)" -ForegroundColor White
Write-Host "  • v1.0 (version 1.0)" -ForegroundColor White
Write-Host ""
Write-Host "You can now show these images to your professor! 🎉" -ForegroundColor Green
