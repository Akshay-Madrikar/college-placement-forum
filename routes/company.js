const express = require('express');

const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');
const { studentById } = require('../controllers/student');
const { 
        companyById, 
        create, 
        read, 
        list,
        listAll, 
        listBySearch, 
        listSearch,
        addQuestion
    } = require('../controllers/company');

const router = express.Router();

router.post('/company/create/:studentId', requiredSignin, isAuth, isAdmin, create);
router.get('/company/:companyId', read);
router.get('/companies/search', listSearch);
router.get('/companies', list);
router.get('/companies/all', listAll);
router.post("/companies/by/search", listBySearch);
router.put("/company/:companyId/question/create/:studentId", requiredSignin, isAuth, addQuestion);

router.param('studentId', studentById)
router.param('companyId', companyById);

module.exports = router;