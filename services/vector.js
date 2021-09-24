const turf = require('@turf/turf')

const constants = require('../config/constants');
const Vector = require('../models/vector'); 
const VectorClass = require('../models/vectorClass');
const Region = require('../models/vectorClass');
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
        1) If vectorId is provided in query params then we send details of that specific vector
        else we send the list of Vectors
        2) For sake simplicity of assignment I haven't implemented paging on vector List but it can be 
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

vectorCtr.filter = async(req,res) => {
    const {
        className,
        area,
        perimeter,
        regionUid,
        polygon
    } = req.query;
    const classId = await VectorClass.findOne({name:className}).project({
        _id: 1 
    }); 
    const regionId = await Region.findOne({uid:regionUid}).project({
        _id: 1 
    });
    Vector.find({
        $or:[
            {polygon: {$geoWithin: {$geometry: polygon}}},
            {classId: classId},
            {regionId: regionId},
        ]
    })
    .then((vectorArr)=>{
        if(area || perimeter){
            filterVectorsByArea(vectorArr, area, perimeter)
            .then((filteredVectors)=>{
                res.status(constants.code.success).json({ msg:'MSG_VECTORS_FOUND', vectors: filteredVectors});
            })
            .catch((err)=>{
                console.error(err);
                res.status(constants.code.error.internalServerError).json({ error:'ERR_INTERNAL_SERVER'});
            })
        }
        else{
            res.status(constants.code.success).json({ msg:'MSG_VECTORS_FOUND', vectors: vectorArr});
        }

    })
}

const filterVectorsByArea = async (vectorArr, area = "", perimeter = "")=>{
    let filteredVectors = [];
    
    if(area && perimeter){
        vectorArr.forEach((vector)=>{
            var areaOfThisPolygon = turf.area(vector.polygon.coordinates);
            //Get Line String from the polygon and then get lineDistance(=perimeter) of that lineString 
            var perimeterOfThisPolygon = turf.lineDistance(turf.linestring(myPoly.coordinates[0]))
            if(area == areaOfThisPolygon && perimeter == perimeterOfThisPolygon){
                filteredVectors.push(vector) 
            }
        });
    }
    else if(area && !perimeter){
        vectorArr.forEach((vector)=>{
            var areaOfThisPolygon = turf.area(vector.polygon.coordinates);
            if(area == areaOfThisPolygon){
                filteredVectors.push(vector) 
            }
        })
    }
    else {
        vectorArr.forEach((vector)=>{
            //Get Line String from the polygon and then get lineDistance(=perimeter) of that lineString 
            var perimeterOfThisPolygon = turf.lineDistance(turf.linestring(myPoly.coordinates[0]))
            if(perimeter == perimeterOfThisPolygon){
                filteredVectors.push(vector) 
            }
        });    
    }
    return filteredVectors;
     
}

module.exports = vectorCtr;