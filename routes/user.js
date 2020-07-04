const express = require('express');

const { userById, readProfile } = require('../controllers/user');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

//--------- Authentication and Authorization check ---------
router.get('/test/:userId', requiredSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    })
});

router.get('/user/:userId',requiredSignin, isAuth, readProfile);

router.param('userId', userById);

module.exports = router;