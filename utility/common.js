const { randomUUID } = require('crypto');

  
const commonUtil = {};

commonUtil.generateUuid = ()=>{
    return randomUUID();
}

commonUtil.checkIfOwner = (userId, regionId) => {
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
module.exports = commonUtil;