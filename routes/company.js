const express = require('express');

const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');
const { studentById } = require('../controllers/student');
const { 
        companyById, 
        create, 
        read,
        update,
        remove, 
        list,
        listAll, 
        listBySearch, 
        listSearch,
        addQuestion,
        totalStudentsPlaced
    } = require('../controllers/company');

const router = express.Router();

router.post('/company/create/:studentId', requiredSignin, isAuth, isAdmin, create);
router.get('/company/:companyId', read);
router.put('/company/:companyId/:studentId', requiredSignin, isAuth, isAdmin, update);
router.delete('/company/:companyId/:studentId', requiredSignin, isAuth, isAdmin, remove);
router.get('/companies/search', listSearch);
router.get('/companies', list);
router.get('/companies/all', listAll);
router.post("/companies/by/search", listBySearch);
router.put("/company/:companyId/question/create/:studentId", requiredSignin, isAuth, addQuestion);
router.put("/company/placed_count", totalStudentsPlaced);

router.param('studentId', studentById)
router.param('companyId', companyById);

module.exports = router;