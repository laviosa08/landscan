const { randomUUID } = require('crypto');

  
const commonUtil = {};

commonUtil.generateUuid = ()=>{
    return randomUUID();
}

module.exports = commonUtil;