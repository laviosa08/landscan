const constants = require('../config/constants');
const Region = require('../models/region'); 
const commonUtil = require('../utility/common');

const regionCtr = {};

regionCtr.create = (req, res) => {
    const {
        description,
        name,
        location
    } = req.body;
    
    const regionData = {
        name,
        description,
        owner,
        location
    };
    regionData.owner = req.user._id,
    regionData.uid = commonUtil.generateUuid();

    const newRegion = new Region(regionData);
    newRegion.save()
    .then((region) => {
        res.status(constants.code.success).json({ msg:'MSG_REGION_CREATED', region: region});
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
        location,
        regionId
    } = req.body;

    const isOwner = commonUtil.checkIfOwner(req.user._id, regionId)
    if(isOwner){
        const updateObj = {
            description:description,
            name:name,
            owner:owner,
            location:location,
        }
        const options = {};
        options.new = true;
        Region.findByIdAndUpdate(regionId,updateObj,options)
        .then((updatedRegion)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_UPDATED', region: updatedRegion});
        })
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error: 'ERR_INTERNAL_SERVER' });
        })
    }
    else{
        res.status(constants.code.error.unauthorized).json({ error: 'USER_NOT_AUTHORISED'});
    }
    
}

regionCtr.delete = (req, res) => {
    const regionId = req.params.regionId
   
    if(!regionId){
        res.status(constants.code.error.notFound).json({ msg:'MSG_REGION_ID_CANNOT_BE_EMPTY'});
    }

    const isOwner = commonUtil.checkIfOwner(req.user._id, regionId)
    
    if(isOwner){
        Region.remove({ _id: regionId })
        .then((deleteObj)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_DELETED', regionDeleted: deleteObj.deletedCount});
        })
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error:'ERR_INTERNAL_SERVER'});
        })
    }
    else{
        res.status(constants.code.error.unauthorized).json({ error: 'USER_NOT_AUTHORISED'});
    }
    

}

regionCtr.getRegion = (req, res) =>{
    const regionId = req.query.regionId;
    /*  
        1) If regionId is provided in query params then we send details of that specific region
        else we send the list of regions
        2) For sake simplicity of assignment I haven't implemented paging on region List but it can be 
        done by adding limit and offset fields.
    */
    if(regionId){
        Region.findOne({ uid: regionId }) //could use _id as well
        .then((region)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_FOUND', region: region});
        })
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error:'ERR_INTERNAL_SERVER'});
        })
    }
    else{
        Region.find()
        .then((regions)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_LIST_FOUND', regions: regions});
        })  
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error: 'ERR_INTERNAL_SERVER'});
        })
    }
    
}

module.exports = regionCtr; 