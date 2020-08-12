const express = require('express');

const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');
const { studentById } = require('../controllers/student');
const { companyById, create, read } = require('../controllers/company');

const router = express.Router();

router.post('/company/create/:studentId',requiredSignin, isAuth, isAdmin, create);
router.get('/company/:companyId', read);

router.param('studentId', studentById)
router.param('companyId', companyById);

module.exports = router;