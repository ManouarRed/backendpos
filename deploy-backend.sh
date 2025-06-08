#!/bin/bash

echo "🚀 Deploying backend to https://backendpos.doubleredcars.sk"

cd /var/www15/p49906/doubleredcars.sk/sub/backendpos || {
  echo "❌ Could not enter app directory"; exit 1;
}

echo "📦 Installing dependencies..."
npm install || {
  echo "❌ npm install failed"; exit 1;
}

# Kill any existing backend process
echo "🔪 Killing previous server..."
pkill -f "node server.js"

# Ensure data folder exists
mkdir -p ./data
chmod -R 755 ./data

# Start server in background
echo "🚀 Starting server..."
nohup node server.js > server.log 2>&1 &

echo "✅ Backend should now be live at https://backendpos.doubleredcars.sk"
