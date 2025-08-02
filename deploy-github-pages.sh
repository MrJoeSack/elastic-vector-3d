#!/bin/bash

# Deploy to GitHub Pages

echo "Building the project..."
npm run build

echo "Adding GitHub Pages deployment..."
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Add deploy script to package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.predeploy = 'npm run build';
pkg.scripts.deploy = 'gh-pages -d dist';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete!"
echo "Your site will be available at: https://mrjoesack.github.io/vector-search-3d"
echo "Note: It may take a few minutes for the site to become available."