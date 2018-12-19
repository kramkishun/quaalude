const logon = require('express').Router();
 /* POST login. */

 module.exports = function(passport) {
    logon.post('/'
    ,function(req,res,next)
    {
            passport.authenticate( 'local-login'
            , {session: false}
            ,function(err, user, info){
                if (err) {return next(err);}
                if (! user) {return res.status(401).send({ success : false, message : info.message });}
                console.log("user found");
                req.user = user;
                next()
            })(req,res,next)
    });

    return logon;
 }
 