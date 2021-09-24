const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const vectorClassSchema = new Schema({
    classId:{ 
        type: Number,
		unique: true,
		required:true
    },
    name:{
        type: String,
		unique: false,
		required:true
    },
	description :{
		type: String,
	}
}, { collection: 'classes', timestamps: true });

const classes = mongoose.model("classes", vectorClassSchema);

module.exports = classes; 