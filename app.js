const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
require('./db/mongoose');
require('dotenv').config();

const app = express();

//------ MIDDLEWARES -------
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//----- ROUTES MIDDLEWARE ------
app.get('/', (req,res) => {
    res.send('Welcome to CPF!');
});

//----- CONNECTION TO MONGODB ---------
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});