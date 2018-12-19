const signup = require('express').Router();
 /* POST login. */

 module.exports = function(passport) {
    signup.post('/', 
    function(req,res,next){
        passport.authenticate('local-signup', {session: false},
        function(err,user,info){if (err) {return next(err);}
        if (! user) {return res.status(401).send({ success : false, message : info.message });}
        console.log("user created");
        req.user = user;
        next()
    })(req,res,next)
    });

    return signup;
}

