const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
require('./db/mongoose');
require('dotenv').config();

const app = express();

//------ MIDDLEWARES -------
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//----- ROUTES MIDDLEWARE ------
app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);

//----- CONNECTION TO MONGODB ---------
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});