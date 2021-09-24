const express = require('express');
const regionCtr = require('../services/region');
const userAuthMiddleware = require('../modules/userAuthMiddleware');

const regionRouter = express.Router();

// Routes

// POST apis
regionRouter.post('/create', userAuthMiddleware.loadUser, regionCtr.create);
regionRouter.post('/update', userAuthMiddleware.loadUser, regionCtr.update);

//DELETE apis
regionRouter.delete('/:id', userAuthMiddleware.loadUser, regionCtr.delete);

// GET apis

//optional to pass regionId as querry string params to get specific region details 
//else a list of regions with details is recieved.
regionRouter.get('/', userAuthMiddleware.loadUser, regionCtr.getRegion);
// userRouter.get('/get-user', userMiddleware.loadUser, userCtr.getProfile);

module.exports = regionRouter;