const express = require('express');

const upload = require('./multer');
const { dataUri } = require('./dataUri');
const { uploadCloudinary } = require('./cloudinary');

const router = express.Router();
const singleUpload = upload.single('image');

const singleUploadCtrl = (req, res, next) => {
    singleUpload(req, res, (error) => {
        if(error) {
            return res.json({
                error: error.message
            })
        }
        next();
    });
};

router.post('/upload', singleUploadCtrl, async (req,res) => {
    try {
        if(!req.file) {
            throw new Error();
        }
        const file64 = dataUri(req.file);
        const result = await uploadCloudinary(file64.content);
        res.json({
            result
        })
    } catch(error) {
        res.status(400).json({
            error: 'Couldnt upload file'
        })
    }
});

module.exports = router;