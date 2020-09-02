const express = require('express');

const { studentById } = require('../controllers/student')
const {  postById, create, read, remove, list, like } = require('../controllers/post');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/post/create/:studentId', requiredSignin, isAuth, create);
router.get('/post/:postId', read);
router.delete('/post/:postId/:studentId', requiredSignin, isAuth , remove);
router.get('/posts', list);
router.put('/like/:postId/:studentId', requiredSignin, isAuth , like);

router.param('studentId', studentById);
router.param('postId', postById);

module.exports = router;