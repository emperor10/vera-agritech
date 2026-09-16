const { v2: cloudinary } = require('cloudinary');
const env = require('../config/env');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

// Uploads a buffer (from multer's memoryStorage) to Cloudinary and resolves
// with the result, which includes secure_url and public_id.
function uploadBuffer(buffer, { publicId } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.folder,
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function destroyByPublicId(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal — an orphaned Cloudinary asset can be cleaned up later and
    // should never block removing/replacing a Media Library entry.
  }
}

module.exports = { cloudinary, uploadBuffer, destroyByPublicId };
