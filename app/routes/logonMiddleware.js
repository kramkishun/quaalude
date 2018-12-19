const jwt   = require('jsonwebtoken');
var secret = require('../../config/settings.js');

module.exports = {

    serialize(req, res, next) {  
        console.log('serialize');
        // we store the updated information in req.user again
        req.user = {
            id: req.user.id
        };
        next();
    },

    generateToken(req, res, next) {  
        req.token = jwt.sign({
        id: req.user.id,
        }, secret.secret , {expiresIn: "120m"});
        next();
    },

    respond(req, res) {  
        res.status(200).json({
        user: req.user,
        token: req.token
        });
    }   
}