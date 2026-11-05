const multer = require("multer");
 
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
];
 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
 
    const err = new Error("That file type isn't allowed. Upload an image, PDF or text file.");
    err.code = "INVALID_FILE_TYPE";
    cb(err);
  },
});
 
// Runs multer, and turns its errors into a message shown on the page the user came from
module.exports = (req, res, next) => {
  upload.single("uploaded_file")(req, res, (err) => {
    if (!err) return next();
 
    let message;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = `That file is too large. The limit is ${MAX_SIZE_MB} MB.`;
    } else if (err.code === "INVALID_FILE_TYPE") {
      message = err.message;
    } else {
      return next(err); // something unexpected: let Express's error handling deal with it
    }
 
    const folderId = Number(req.body.folderId);
    const back = folderId ? `/folders/${folderId}` : "/folders";
    res.redirect(`${back}?error=${encodeURIComponent(message)}`);
  });
};
