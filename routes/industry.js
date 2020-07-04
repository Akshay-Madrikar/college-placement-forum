const express = require('express');

const { studentById } = require('../controllers/student')
const { industryById, create, read } = require('../controllers/industry');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/industry/create/:studentId', requiredSignin, isAuth, isAdmin, create);
router.get('/industry/:industryId', read);

router.param('studentId', studentById)
router.param('industryId', industryById);

module.exports = router;