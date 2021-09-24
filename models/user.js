const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userid: {
		type: String,
		unique:true,
		required: true
	},
    fullname:{
        type: String,
		unique: false,
		required:true
    },
	username :{
		type: String,
		unique: true,
		required:true
	},
	password :{
		type:String,
		required:true
    }
}, { collection: 'users', timestamps: true });


const users = mongoose.model("user", userSchema);

module.exports = users; 