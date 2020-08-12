const path = require('path');
const DatauriParser = require('datauri/parser');

const dUri = new DatauriParser();

// To convert dataBuffer into base64 representation of image
exports.dataUri = (file) => dUri.format(path.extname(file.originalname).toString(), file.buffer);