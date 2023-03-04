const multer = require('multer');
const path = require('path')

const config = require('./config')

const storage = multer.memoryStorage()

let upload = multer({
    storage: storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(!config.allowedUploadTypes.includes(ext)) {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
})

module.exports = upload;