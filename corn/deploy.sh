#!/bin/bash

# Quick deployment script for corn scheduler

echo "Installing dependencies..."
npm install

echo ""
echo "Logging in to Cloudflare..."
npx wrangler login

echo ""
echo "Deploying worker..."
npm run deploy

echo ""
echo "✅ Deployment complete!"
echo "The worker will trigger https://xyz.com/trigger at:"
echo "  - 10:00 AM IST (4:30 AM UTC) daily"
echo "  - 6:00 PM IST (12:30 PM UTC) daily"
