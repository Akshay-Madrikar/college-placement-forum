const express = require('express');

const { studentById,
        readProfile, 
        updateProfile, 
        list, 
        block, 
        unblock, 
        resetPassword, 
        newPassword
    } = require('../controllers/student');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

//--------- Authentication and Authorization check ---------
router.get('/test/:studentId', requiredSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/students/all', list)
router.get('/student/:studentId',requiredSignin, isAuth, readProfile);
router.put('/student/update/:studentId',requiredSignin, isAuth, updateProfile);
router.put('/block/student/:studentId/:studentId',requiredSignin, isAuth, isAdmin, block);
router.put('/unblock/student/:studentId/:studentId',requiredSignin, isAuth, isAdmin, unblock);
router.post('/reset-password', resetPassword);
router.post('/new-password', newPassword);

router.param('studentId', studentById);

module.exports = router;