const fs = require('fs');
const path = require('path');
const env = require('../config/env');

/**
 * Small adapter so routes don't need to know whether images live on local
 * disk (HostAfrica, or any host with real persistent storage) or on
 * Cloudinary (Render free tier and other hosts with an ephemeral
 * filesystem). Selected by IMAGE_STORAGE — see config/env.js.
 *
 * Both drivers expose the same shape:
 *   saveUpload(file, key) -> { url, ref }   — ref is opaque, stored in the
 *                                             images.cloudinary_public_id
 *                                             column (generic storage
 *                                             reference despite the name)
 *   removeUpload(ref)     -> void, never throws
 */

const localDriver = {
  // multer's diskStorage has already written the file by the time this
  // runs (see middleware/upload.js) — just report where it landed.
  async saveUpload(file) {
    const url = `${env.appUrl.replace(/\/$/, '')}/uploads/${file.filename}`;
    return { url, ref: file.filename };
  },
  async removeUpload(ref) {
    if (!ref) return;
    try {
      const filePath = path.join(env.uploadsDir, ref);
      if (filePath.startsWith(env.uploadsDir) && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Non-fatal: an orphaned file on disk can be cleaned up later.
    }
  },
};

const cloudinaryDriver = {
  async saveUpload(file, key) {
    const { uploadBuffer } = require('../config/cloudinary');
    const publicId = key.toString().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
    const result = await uploadBuffer(file.buffer, { publicId });
    return { url: result.secure_url, ref: result.public_id };
  },
  async removeUpload(ref) {
    const { destroyByPublicId } = require('../config/cloudinary');
    await destroyByPublicId(ref);
  },
};

module.exports = env.imageStorage === 'local' ? localDriver : cloudinaryDriver;
