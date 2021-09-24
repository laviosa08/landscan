const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

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

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JwtSecret);
    return token;
};

const users = mongoose.model("user", userSchema);

module.exports = users; 