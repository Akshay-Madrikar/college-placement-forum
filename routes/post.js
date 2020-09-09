const express = require('express');

const { studentById } = require('../controllers/student')
const {  postById, create, read, remove, list, like, unlike, comment, removeComment } = require('../controllers/post');
const { requiredSignin, isAuth, isAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/post/create/:studentId', requiredSignin, isAuth, create);
router.get('/post/:postId', read);
router.delete('/post/:postId/:studentId', requiredSignin, isAuth , remove);
router.get('/posts', list);
router.put('/like/:postId/:studentId', requiredSignin, isAuth , like);
router.put('/unlike/:postId/:studentId', requiredSignin, isAuth , unlike);
router.put('/comment/:postId/:studentId', requiredSignin, isAuth , comment);
router.delete('/comment/:postId/:studentId/:commentId', requiredSignin, isAuth , removeComment);

router.param('studentId', studentById);
router.param('postId', postById);

module.exports = router;