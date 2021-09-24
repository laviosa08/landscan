const constants = require('../config/constants');
const Region = require('../models/region'); 
const commonUtil = require('../utility/common');

const regionCtr = {};

regionCtr.create = (req, res) => {
    const {
        description,
        name,
        owner,
        location
    } = req.body;

    const regionData = {
        name,
        description,
        owner,
        location
    };

    regionData.uid = commonUtil.generateUuid();

    const newRegion = new Region(regionData);
    newRegion.save()
    .then((region) => {
        return res.status(constants.code.success).json({ msg:'MSG_REGION_CREATED', region: region});
    })
    .catch((err)=>{
        console.error(err);
        res.status(constants.code.error.internalServerError).json({ error: req.t('ERR_INTERNAL_SERVER') });
    })
}

regionCtr.update = (req, res) => {
    const {
        description,
        name,
        owner,
        location
    } = req.body;


}

regionCtr.delete = (req, res) => {
    
}

regionCtr.getRegion = (req, res) =>{

}
module.exports = regionCtr; 