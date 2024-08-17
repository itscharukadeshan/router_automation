#!/bin/bash

# Navigate to the app directory
cd /home/charuka/Web_dev/router_utils_api

# Stop any previous instance of the app
pkill -f "node build/index.js"

# Start the app using Node.js
node build/index.js &

# Get the PID of the newly started process
APP_PID=$!
echo "Router Utils API started with PID: $APP_PID"
