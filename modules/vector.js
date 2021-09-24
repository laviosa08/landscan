const express = require('express');
const vectorCtr = require('../services/vector');
const userAuthMiddleware = require('../modules/userAuthMiddleware');

const vectorRouter = express.Router();

// Routes

// POST apis
vectorRouter.post('/create', userAuthMiddleware.loadUser, vectorCtr.create);
vectorRouter.post('/update', userAuthMiddleware.loadUser, vectorCtr.update);

//DELETE apis
vectorRouter.delete('/:id', userAuthMiddleware.loadUser, vectorCtr.delete);

// GET apis

//optional to pass vectorId as querry string params to get specific vector details 
//else a list of vectors with details is recieved.
vectorRouter.get('/', userAuthMiddleware.loadUser, vectorCtr.getVector);
vectorRouter.get('/filter', userAuthMiddleware.loadUser, vectorCtr.filter);

module.exports = vectorRouter;