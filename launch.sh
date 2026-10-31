#!/usr/bin/env bash
# NexusHR - Quick Local Launch Script

PORT=8080
echo "⚡ Starting NexusHR Enterprise Frontend on http://localhost:$PORT..."

# Open in browser after 1 second in background
(sleep 1 && (open "http://localhost:$PORT" 2>/dev/null || xdg-open "http://localhost:$PORT" 2>/dev/null || start "http://localhost:$PORT" 2>/dev/null)) &

# Start simple python HTTP server
python3 -m http.server $PORT
