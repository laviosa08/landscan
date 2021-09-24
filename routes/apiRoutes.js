const express = require('express');
const router = express.Router();
const userModule = require('../modules/user')
const regionModule = require('../modules/region');
const vectorModule = require('../modules/vector')

router.use('/user', userModule);
router.use('/region', regionModule);
router.use('/vector', vectorModule);


router.all('/*', (req, res) => {
    return res.status(500).json({
        error: 'ERR_URL_NOT_FOUND',
    });
});


module.exports = router;