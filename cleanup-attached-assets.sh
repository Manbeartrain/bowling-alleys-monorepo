#!/bin/bash
# Script to move attached_assets to frontend/public and clean up unused files

set -e

echo "🧹 Cleaning up attached_assets..."

# Step 1: Move attached_assets to frontend/public/
if [ -d "attached_assets" ]; then
  echo "📦 Moving attached_assets to frontend/public/..."
  mkdir -p frontend/public
  mv attached_assets frontend/public/attached_assets
  echo "✅ Moved attached_assets to frontend/public/attached_assets"
else
  echo "⚠️  attached_assets directory not found (may already be moved)"
fi

# Step 2: Delete temporary/notes files
echo "🗑️  Deleting temporary files..."
cd frontend/public/attached_assets

# Delete content markdown files
find . -name "content-*.md" -type f -delete 2>/dev/null || true

# Delete pasted text files
find . -name "Pasted-*.txt" -type f -delete 2>/dev/null || true

# Delete EPS files (vector graphics not used)
find . -name "*.eps" -type f -delete 2>/dev/null || true

# Delete generated_images folder (unused favicon variants)
if [ -d "generated_images" ]; then
  rm -rf generated_images
fi

# Delete specific unused images (be careful - verify these aren't used!)
echo "⚠️  About to delete unused images. Review the list first!"
echo "Unused images to delete:"
echo "  - Modern_bowling_alley_hero_7666fb5d_1758627693077.webp"
echo "  - hat_3651870_(1)_1765566311238.png"
echo "  - AdobeStock_317260636_1766681755934.jpeg"
echo "  - AdobeStock_317260636_Preview_1766681700899.jpeg"
echo "  - skull_3274934_1765566963587.png"
echo "  - S11_1765476116611.webp"
echo "  - variation1_1767047038371.webp"
echo "  - F8482EF0-42DC-482A-8AAB-80936EBBD3E7_1762884737796.png"
echo "  - vecteezy_pin-bowling-icon-isolated-on-white-background_1539733_1765464826718.jpg"

read -p "Delete these unused images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -f Modern_bowling_alley_hero_7666fb5d_1758627693077.webp
  rm -f "hat_3651870_(1)_1765566311238.png"
  rm -f AdobeStock_317260636_1766681755934.jpeg
  rm -f AdobeStock_317260636_Preview_1766681700899.jpeg
  rm -f skull_3274934_1765566963587.png
  rm -f S11_1765476116611.webp
  rm -f variation1_1767047038371.webp
  rm -f F8482EF0-42DC-482A-8AAB-80936EBBD3E7_1762884737796.png
  rm -f vecteezy_pin-bowling-icon-isolated-on-white-background_1539733_1765464826718.jpg
  echo "✅ Deleted unused images"
else
  echo "⏭️  Skipped deleting unused images"
fi

cd ../../..

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update frontend/next.config.js - Remove @assets alias (no longer needed)"
echo "2. Update server/index.ts - Remove static asset serving (lines 76-78)"
echo "3. Test that all assets still load correctly"
echo "4. Update MONOREPO_MIGRATION.md with new structure"

