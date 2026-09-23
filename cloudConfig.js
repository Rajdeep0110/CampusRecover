const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Ensure public/uploads directory exists for local fallback
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

/**
 * Processes an uploaded file (from req.file).
 * Attempts Cloudinary upload first if configured. If Cloudinary fails (e.g. 403 Forbidden),
 * falls back seamlessly to serving the file locally from /uploads.
 */
async function processImageUpload(req) {
    if (!req.file) return "";

    try {
        if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
            const uploadOptions = {
                folder: "campusRecover_DEV",
                resource_type: "auto"
            };

            let result;
            if (process.env.CLOUDINARY_UPLOAD_PRESET) {
                result = await cloudinary.uploader.unsigned_upload(
                    req.file.path,
                    process.env.CLOUDINARY_UPLOAD_PRESET,
                    uploadOptions
                );
            } else {
                result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
            }

            // Clean up temporary local file after successful Cloudinary upload
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return result.secure_url;
        }
    } catch (cloudErr) {
        console.error("Cloudinary upload error details:", cloudErr.error || cloudErr.message || cloudErr);
        console.warn("Falling back to local storage due to Cloudinary failure.");
    }

    // Fallback: Return relative URL path for locally saved file
    return "/uploads/" + req.file.filename;
}

module.exports = {
    cloudinary,
    storage,
    processImageUpload
};