const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
    process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

mongoose.connection.on('connected', err => {
    console.log('Connected to Mongodb');
});

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});