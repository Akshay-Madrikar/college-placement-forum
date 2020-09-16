const express = require('express');

const { studentById, readProfile, updateProfile } = require('../controllers/student');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

//--------- Authentication and Authorization check ---------
router.get('/test/:studentId', requiredSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/student/:studentId',requiredSignin, isAuth, readProfile);
router.put('/student/:studentId',requiredSignin, isAuth, updateProfile);

router.param('studentId', studentById);

module.exports = router;