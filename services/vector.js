const constants = require('../config/constants');
const Vector = require('../models/vector'); 
const commonUtil = require('../utility/common');

const vectorCtr = {};

vectorCtr.create = (req,res) => {
    const {
        description,
        name,
        polygon,
        classId,
        regionId
    } = req.body;
    
    const vectorData = {
        name,
        description,
        owner,
        polygon,
        classId,
        regionId
    };
    vectorData.owner = req.user._id,
    vectorData.uid = commonUtil.generateUuid();

    const newVector = new Vector(vectorData);
    newVector.save()
    .then((vector) => {
        res.status(constants.code.success).json({ msg:'MSG_VECTOR_CREATED', vector: vector});
    })
    .catch((err)=>{
        console.error(err);
        res.status(constants.code.error.internalServerError).json({ error: req.t('ERR_INTERNAL_SERVER') });
    })
}

vectorCtr.update = (req,res) => {
    const {
        name,
        regionId,
        description,
        owner,
        polygon,
        classId,
        vectorId
    } = req.body;

    const isOwner = commonUtil.checkIfVectorOwner(req.user._id, vectorId)
    if(isOwner){
        const updateObj = {
            description:description,
            name:name,
            owner:owner,
            polygon:polygon,
            regionId:regionId,
            classId:classId,
        }
        const options = {};
        options.new = true;
        Vector.findByIdAndUpdate(vectorId,updateObj,options)
        .then((updatedVector)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_UPDATED', vector: updatedVector});
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

vectorCtr.delete = (req,res) => {
    const vectorId = req.params.vectorId
   
    if(!vectorId){
        res.status(constants.code.error.notFound).json({ msg:'MSG_VECTOR_ID_CANNOT_BE_EMPTY'});
    }

    const isOwner = commonUtil.checkIfVectorOwner(req.user._id, vectorId)
    
    if(isOwner){
        Vector.remove({ _id: vectorId })
        .then((deleteObj)=>{
            res.status(constants.code.success).json({ msg:'MSG_REGION_DELETED', vectorDeleted: deleteObj.deletedCount});
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

vectorCtr.getVector = (req,res) => {
    const vectorId = req.query.vectorId;
    /*  
        1) If regionId is provided in query params then we send details of that specific region
        else we send the list of regions
        2) For sake simplicity of assignment I haven't implemented paging on region List but it can be 
        done by adding limit and offset fields.
    */
    if(vectorId){
        vectorId.findOne({ uid: vectorId }) //could use _id as well
        .then((vector)=>{
            res.status(constants.code.success).json({ msg:'MSG_VECTOR_FOUND', vector: vector});
        })
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error:'ERR_INTERNAL_SERVER'});
        })
    }
    else{
        Vector.find()
        .then((vectors)=>{
            res.status(constants.code.success).json({ msg:'MSG_VECTOR_LIST_FOUND', vectors: vectors});
        })  
        .catch((err)=>{
            console.error(err);
            res.status(constants.code.error.internalServerError).json({ error: 'ERR_INTERNAL_SERVER'});
        })
    }
}

vectorCtr.filter = (req,res) => {

}


module.exports = vectorCtr;