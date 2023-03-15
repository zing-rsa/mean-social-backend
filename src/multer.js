const multer = require('multer');
const path = require('path')

const config = require('./config')

const storage = multer.memoryStorage()

let upload = multer({
    storage: storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if(!config.allowedUploadTypes.includes(ext)) {
            return cb(new Error('Unexpected filetype. Accepts ' + config.allowedUploadTypes.join(', ')))
        }
        cb(null, true)
    },
})

const handleMulterException = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.message === 'File too large') {
            return res.status(400).json({ message: `File too large, max size: ${config.maxFileSize/1000}kb` });
        }
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = { 
    handleMulterException,
    upload
};