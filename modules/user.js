const express = require('express');
const userCtr = require('../services/user');

const userRouter = express.Router();

// Routes

// POST apis
userRouter.post('/signup', userCtr.signup);
userRouter.post('/signin', userCtr.signin);

// GET apis
// userRouter.get('/get-user', userMiddleware.loadUser, userCtr.getProfile);

module.exports = userRouter;