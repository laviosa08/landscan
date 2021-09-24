const constants = require('../config/constants');
const User = require('../models/user'); 
const commonUtil = require('../utility/common');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userCtr = {};

// User Login
userCtr.signin = async(req, res) => {
    const {
        password,
        userName,
    } = req.body;
    // Find user with requested username 
    User.findOne({ username : req.body.username }, function(err, user) { 
        if(err){
            console.error("error: ",err)
        }
        if (user === null) { 
            return res.status(constants.code.error.notFound).json({ 
                message : "User not found."
            }); 
        } 
        else { 
            if (bcrypt.compare(password, user.password)) {
                const token = generateAuthToken(user._id);
                return res.status(constants.code.success).json({ 
                    message : "User Logged In",
                    token: token 
                }) 
            } 
            else { 
                return res.status(constants.code.error.unauthorized).json({ 
                    error : "Wrong Password"
                }); 
            } 
        } 
    }); 
}; 

// User SignUp
userCtr.signup = async (req, res) => {
    const {
        password,
        userName,
        fullName,
    } = req.body;

    //Check if user already exist
    const ifUserExist = await User.findOne({username: username});

    if(ifUserExist){
        res.status(constants.code.error.Conflict).json({ error: 'USER_ALREADY_EXIST' });
    }
    
    const userData = {
        userName,
        fullName,
    };

    //Encrypt user password
    userData.password = await bcrypt.hash(password, 10); 
    
    //Set uniquie user_id
    userData.userid = commonUtil.generateUuid();

    createUser(userData).then((user) => {
        //set user token
        let token = generateAuthToken(user._id);
        return res.status(constants.code.success).json({ msg:'MSG_USER_CREATED', user: user, token:token});
    }).catch((err) => {
        logger.error(err);
        res.status(constants.code.error.internalServerError).json({ error: req.t('ERR_INTERNAL_SERVER') });
    });          

}; 

// Save newUser object to database 
const createUser = (userData) =>{
    const newUser = new User(userData);
    newUser.save()
    .then((user) => {
        return user
    })
    .catch((err)=>{
        throw err
    }) 
}

const generateAuthToken = (userId)=>{
    const token = jwt.sign({ _id: userId}, process.env.JwtSecret);
    return token;
}
// Export module to allow it to be imported in other files 
module.exports = userCtr; 