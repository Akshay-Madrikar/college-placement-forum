const express = require('express');

const { studentById } = require('../controllers/student');
const { departmentById, create, read, update, remove, list } = require('../controllers/department');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/department/create/:studentId', requiredSignin, isAuth, isAdmin, create);
router.get('/department/:departmentId', read);
router.put('/department/:departmentId/:studentId', requiredSignin, isAuth, isAdmin ,update);
router.delete('/department/:departmentId/:studentId', requiredSignin, isAuth, isAdmin , remove);
router.get('/departments', list);

router.param('studentId', studentById);
router.param('departmentId', departmentById);

module.exports = router;