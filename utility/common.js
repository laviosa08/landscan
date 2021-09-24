const { randomUUID } = require('crypto');
const Vector = require('../models/vector'); 
const Region = require('../models/region'); 

const commonUtil = {};

commonUtil.generateUuid = ()=>{
    return randomUUID();
}

commonUtil.checkIfRegionOwner = (userId, regionId) => {
    Region.findById(regionId)
    .then((region)=>{
        if(region.owner == userId){
            return true;
        }
        else   
            return false;
    })
    .catch((err)=>{
        console.error(err);
        throw err;
    })
}

commonUtil.checkIfVectorOwner = (userId, vectorId) => {
    Vector.findById(vectorId)
    .then((vector)=>{
        if(vector.owner == userId){
            return true;
        }
        else   
            return false;
    })
    .catch((err)=>{
        console.error(err);
        throw err;
    })
}
module.exports = commonUtil;