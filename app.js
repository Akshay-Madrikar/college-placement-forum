const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth');
const studentRouter = require('./routes/student');
const industryRouter = require('./routes/industry');
const companyRouter = require('./routes/company');
const postRouter = require('./routes/post');
const imageRouter = require('./utils/image_upload');
require('./db/mongoose');
require('dotenv').config();

const app = express();

//------ MIDDLEWARES -------
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//----- ROUTES MIDDLEWARE ------
app.use("/api/v1", authRouter);
app.use("/api/v1", studentRouter);
app.use("/api/v1", companyRouter);
app.use("/api/v1", industryRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", imageRouter);

//----- CONNECTION TO MONGODB ---------
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});