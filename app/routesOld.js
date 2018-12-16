// app/routes.js
let request = require('request')
// load up the user model
let News = require('./models/news');


var Portfoilo = require('./models/portfolio');
const jwt   = require('jsonwebtoken');

var secret = require('../config/settings.js');

const expressJwt = require('express-jwt');  
const authenticate = expressJwt(secret);

//todo.. each of these routes should be there own file with express.routs
module.exports = function(app, passport) {


    //===================================================
    //==  Open Api Calls no logon needed
    //===================================================
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : 'http://localhost:3000/', // redirect to the secure profile section
        failureRedirect : 'http://localhost:3002/', // redirect back to the signup page if there is an error
        failureFlash : true, // allow flash messages
        session: true
    }));

    /* POST login. */
    app.post('/auth', passport.authenticate(  
      'local-login', {
        session: false
      }), serialize, generateToken, respond);

    function serialize(req, res, next) {  
            console.log('serialize');
            // we store the updated information in req.user again
            req.user = {
                id: req.user.id
              };
            next();
    }

    function generateToken(req, res, next) {  
        req.token = jwt.sign({
          id: req.user.id,
        }, secret.secret , {expiresIn: "120m"});
        next();
      }

      function respond(req, res) {  
        res.status(200).json({
          user: req.user,
          token: req.token
        });
      }      



    app.get('/me', authenticate, function(req, res) {  
    res.status(200).json(req.user);
    });
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', authenticate, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/createPortfolio', authenticate, function(req,res){

        var newPortfolio = new Portfoilo();

        // set the user's local credentials
        newPortfolio.name    = req.query.name;
        newPortfolio.createdBy = req.user.id;

        // save the portfolio
        newPortfolio.save(function(err) {
            if (err){
                console.log(err)
                throw err;
            }
            res.status(200).json({Status: 'Portfolio added '});
        });
        
    });

    app.post('/addStock', authenticate, function(req, res){
        var sym = req.query.sym;
        var amount = req.query.amount;
        var ID = req.query.portfolioID
        console.log("adding "+ sym );
        console.log("user id:"+req.user.id);
        console.log("portfolio ID:" + ID);
        Portfoilo.findById(ID).
            populate('createdBy').exec(function (err, portfoilo)
           {
               if(err){
                   console.log("no user associated with this portfoio");
                   return done(err);
               }
               if(portfoilo.createdBy._id == req.user.id)
               {
                   //add stock
                   var stock = {symble: sym,amount: amount};
                   portfoilo.stocks.push(stock);
                   portfoilo.save(function(err) {
                    if (err){
                        console.log(err)
                        throw err;
                    }
                    res.status(200).json({Status: 'Portfolio added '});
                });
               }
           });
/*         User.findByIdAndUpdate(req.user.id, 
            {$push: {stocks: { "symble": sym, "amount": amount }}},
            {safe: true, upsert: true},
            function(err,user) {
            console.log("looking for user id"+ user);
            if (err){
            console.log("user not found ");
                return done(err);
            }
            else {
                console.log("user found ");
                res.status(200).json({status: "UPDATED"});
            }
        }) */

    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};
