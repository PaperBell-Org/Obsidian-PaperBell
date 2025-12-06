#!/bin/bash

# Obsidian Project Timeline - Build & Deploy Script
# Usage: ./build_and_deploy.sh

# 1. Navigate to project directory
cd "$(dirname "$0")" || exit

echo "🚀 Starting build process..."

# 2. Install dependencies (if package-lock.json changed or node_modules missing)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 3. Run Vite Build
echo "🔨 Building React project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# 4. Deploy artifacts to Obsidian scripts folder
echo "📂 Deploying to Obsidian..."

TARGET_LIB_DIR="/libs"

# Ensure target directory exists
mkdir -p "$TARGET_LIB_DIR"

# Copy UMD bundle
cp "dist/timeline-bundle.umd.js" "$TARGET_LIB_DIR/timeline-bundle.js"

# Copy CSS
cp "dist/项目管理 Dashboard 原型.css" "$TARGET_LIB_DIR/timeline-style.css"

echo "✅ Successfully deployed!"
echo "   - JS: $TARGET_LIB_DIR/timeline-bundle.js"
echo "   - CSS: $TARGET_LIB_DIR/timeline-style.css"
echo "👉 Reload your Obsidian note to see changes."
