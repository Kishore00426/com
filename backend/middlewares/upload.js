import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

// ------------------------------------------------------------
// Ensure upload folders exist
// ------------------------------------------------------------
const folders = ["uploads/original", "uploads/thumb", "uploads/preview"];
folders.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ------------------------------------------------------------
// Multer storage (temp upload)
// ------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/original/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ------------------------------------------------------------
// File filter
// ------------------------------------------------------------
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, WEBP allowed"), false);
};

// ------------------------------------------------------------
// Multer init
// ------------------------------------------------------------
export const upload = multer({ storage, fileFilter });

// ------------------------------------------------------------
// Sharp — create thumb, preview, original
// ------------------------------------------------------------
export const processImages = async (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const ext = path.extname(req.file.filename);
  const base = req.file.filename.replace(ext, "");

  // Final filenames
  const thumbFile = `${base}${ext}`;
  const previewFile = `${base}${ext}`;
  const originalFile = `${base}${ext}`;

  const thumbPath = `uploads/thumb/${thumbFile}`;
  const previewPath = `uploads/preview/${previewFile}`;
  const originalPath = `uploads/original/${originalFile}`;

  try {
    await sharp(inputPath).resize(200).toFile(thumbPath);
    await sharp(inputPath).resize(600).toFile(previewPath);
    fs.copyFileSync(inputPath, originalPath);

    req.files = {
      thumbnail: [{ filename: thumbFile }],
      preview: [{ filename: previewFile }],
      original: [{ filename: originalFile }],
    };

    next();
  } catch (err) {
    console.error("Sharp processing error:", err);
    return res.status(500).json({
      success: false,
      message: "Image processing failed",
    });
  }
};
