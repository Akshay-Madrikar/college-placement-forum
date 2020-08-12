const multer = require('multer');

const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        if(ALLOWED_FORMATS.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File format not supported'), false);
        }
    }
});

module.exports = upload;