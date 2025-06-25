#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGES_DIR = path.join(__dirname, '../client/public/images');
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 225; // 16:9 aspect ratio
const QUALITY = 80;

// Image formats to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImages() {
  console.log('🚀 Starting image optimization...');
  
  try {
    // Check if images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      console.error('❌ Images directory not found:', IMAGES_DIR);
      return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
    );

    console.log(`📁 Found ${imageFiles.length} images to process`);

    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      const fileName = path.parse(file).name;
      const extension = path.parse(file).ext;

      console.log(`🔄 Processing: ${file}`);

      try {
        // Create thumbnail
        const thumbnailPath = path.join(IMAGES_DIR, `${fileName}-thumb${extension}`);
        await sharp(filePath)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: QUALITY })
          .toFile(thumbnailPath);

        // Create WebP version
        const webpPath = path.join(IMAGES_DIR, `${fileName}.webp`);
        await sharp(filePath)
          .webp({ quality: QUALITY })
          .toFile(webpPath);

        // Create WebP thumbnail
        const webpThumbPath = path.join(IMAGES_DIR, `${fileName}-thumb.webp`);
        await sharp(filePath)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: QUALITY })
          .toFile(webpThumbPath);

        console.log(`✅ Optimized: ${file}`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    console.log('🎉 Image optimization completed!');
    
    // Generate optimization report
    generateReport();

  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

function generateReport() {
  const files = fs.readdirSync(IMAGES_DIR);
  const originalImages = files.filter(file => 
    IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext)) &&
    !file.includes('-thumb') &&
    !file.endsWith('.webp')
  );

  const thumbnails = files.filter(file => file.includes('-thumb'));
  const webpImages = files.filter(file => file.endsWith('.webp'));

  console.log('\n📊 Optimization Report:');
  console.log(`   Original images: ${originalImages.length}`);
  console.log(`   Thumbnails created: ${thumbnails.length}`);
  console.log(`   WebP versions created: ${webpImages.length}`);
  console.log(`   Total files: ${files.length}`);
}

// Run optimization
if (require.main === module) {
  optimizeImages();
}

module.exports = { optimizeImages }; 