const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const regionSchema = new Schema({
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
    //longitude comes first in a GeoJSON coordinate array, not latitude
	location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        index: '2dsphere' // Create a special 2dsphere index on `location`
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
}, { collection: 'regions', timestamps: true });

const users = mongoose.model("user", regionSchema);

module.exports = users; 