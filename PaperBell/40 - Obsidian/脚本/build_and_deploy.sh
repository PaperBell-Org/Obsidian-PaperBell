#!/bin/bash

# Obsidian Project Timeline - Build & Deploy Script
# Usage: ./build_and_deploy.sh

# 1. Navigate to project directory (Project-Manager folder)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../Project-Manager"
cd "$PROJECT_DIR" || exit

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

TARGET_LIB_DIR="../脚本/libs"

# Ensure target directory exists
mkdir -p "$TARGET_LIB_DIR"

# Copy UMD bundle
cp "dist/timeline-bundle.umd.js" "$TARGET_LIB_DIR/timeline-bundle.js"

# Copy CSS (check for different possible CSS file names)
if [ -f "dist/index.css" ]; then
    cp "dist/index.css" "$TARGET_LIB_DIR/timeline-style.css"
elif [ -f "dist/style.css" ]; then
    cp "dist/style.css" "$TARGET_LIB_DIR/timeline-style.css"
else
    echo "⚠️  Warning: CSS file not found in dist/, checking for any .css file..."
    CSS_FILE=$(find dist -name "*.css" | head -1)
    if [ -n "$CSS_FILE" ]; then
        cp "$CSS_FILE" "$TARGET_LIB_DIR/timeline-style.css"
        echo "   Found and copied: $CSS_FILE"
    else
        echo "❌ Error: No CSS file found in dist/"
    fi
fi

echo "✅ Successfully deployed!"
echo "   - JS: $TARGET_LIB_DIR/timeline-bundle.js"
echo "   - CSS: $TARGET_LIB_DIR/timeline-style.css"
echo "👉 Reload your Obsidian note to see changes."
