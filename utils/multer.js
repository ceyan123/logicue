const multer = require("multer");
const path = require("path");

// var maxSize = 1 * 1000 * 1000;

//Multer config
module.exports = multer({
    storage: multer.diskStorage({}),
    // limits: { fileSize: 1000},
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});