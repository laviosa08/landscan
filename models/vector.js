const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const vectorSchema = new Schema({
    uid: {
		type: String,
		unique:true,
		required: true
	},
    name:{
        type: String,
		unique: false,
		required:true
    },
	description :{
		type: String,
	},
    classId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true,
    },
    //longitude comes first in a GeoJSON coordinate array, not latitude
	polygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: true
        },
    },
    regionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'regions',
        required: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
}, { collection: 'vectors', timestamps: true });

// Create a special 2dsphere index on `polygon`
vectorSchema.index({ polygon: "2dsphere"});

const vectors = mongoose.model("vectors", vectorSchema);

module.exports = vectors; 