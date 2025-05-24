#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Clean up previous builds
echo "Cleaning up previous builds..."
rm -rf deploy
rm -f deploy.zip

# Build frontend
echo "Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Build backend
echo "Building backend..."
cd backend
npm ci
npm run build
cd ..

# Create deployment directory
echo "Creating deployment directory..."
mkdir -p deploy/public
mkdir -p deploy/backend

# Copy frontend build
echo "Copying frontend build..."
cp -r frontend/build/* deploy/public/

# Copy backend files
echo "Copying backend files..."
cp -r backend/dist/* deploy/backend/
cp backend/package.json deploy/backend/
cp backend/package-lock.json deploy/backend/
cp backend/.env.example deploy/backend/.env
cp backend/web.config deploy/backend/
cp backend/.htaccess deploy/backend/

# Create production package.json
echo "Creating production package.json..."
cat > deploy/package.json << EOL
{
  "name": "van-soest-cms",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "cd backend && npm install --production && node dist/server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOL

# Create deployment package
echo "Creating deployment package..."
cd deploy
zip -r ../deploy.zip .
cd ..

echo "Deployment package created: deploy.zip"
echo ""
echo "Next steps:"
echo "1. Upload deploy.zip to your Strato hosting via FTP"
echo "2. Extract the contents to your web root"
echo "3. Configure your .env file with the correct values"
echo "4. Set up your Firebase project and add the credentials"
echo "5. Configure your domain and SSL certificates"
echo "6. Run 'npm start' to start the application" 