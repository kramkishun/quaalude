// app/routes.js
let request = require('request')
// load up the user model
var User    = require('../app/models/users');
const jwt   = require('jsonwebtoken');

//todo.. each of these routes should be there own file with express.routs
module.exports = function(app, passport) {


    //===================================================
    //==  Open Api Calls no logon needed
    //===================================================
    app.get('/', (req, res) => res.send('Check out /tsdata'));

    // Right now just serving as a pass through
    app.get('/tsdata/:sym', (req, res) => {

        const pickleRisk = 'http://localhost:5000/history/' + req.params.sym;

        request(pickleRisk, ((symbol, responseObj) => {
            return (pErr, pReq, pBody) => {
            if (pErr) {
                console.log (pErr);
                console.log ("Could not retrieve data from pickleRisk for: " + symbol);
                return;
            }
        
            console.log ("Received data from pickleRisk for " + req.params.sym);
        
            datesAndCloses = JSON.parse(pBody);
            responseObj.json(datesAndCloses);
            }
        })(req.params.sym, res));
    });

    // BUG: any kind of unexpected response (e.g. HTML) causes crashes.

    app.get('/multitsdata', (req, res) => {
        console.log ('Multi Symbol Request')

        const pickleRisk = 'http://localhost:5000/multihistory?symbols=' + req.query.symbols;

        request(pickleRisk, ((symbols, responseObj) => {
            try {
                if (pErr) {
                  console.log (pErr);
                  console.log ("Could not retrieve data from pickleRisk for: " + symbol);
                  return;
                }
            
                console.log ("Received data from pickleRisk for " + req.params.sym);
            
                datesAndCloses = JSON.parse(pBody);
                responseObj.json(datesAndCloses);
            } catch (e) {
                console.log(e);
            }
        })(req.query.symbols, res));
    });

    app.get('/returndata/:sym', (req, res) => {
        console.log ('Return Request')
      
        const pickleRisk = 'http://localhost:5000/returns/' + req.params.sym;
      
        request(pickleRisk, ((symbols, responseObj) => {
          return (pErr, pReq, pBody) => {
            if (pErr) {
              console.log (pErr);
              console.log ("Could not retrieve return data from pickleRisk for: " + symbols);
              return;
            }
      
            console.log('Received return from pickleRisk for ' + symbols);
            responseObj.json(JSON.parse(pBody))
          }
        })(req.params.sym, res));
      });

    

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
        }, 'server secret', {expiresIn: "120m"});
        next();
      }

      function respond(req, res) {  
        res.status(200).json({
          user: req.user,
          token: req.token
        });
      }      


    const expressJwt = require('express-jwt');  
    const authenticate = expressJwt({secret : 'server secret'});
    app.get('/me', authenticate, function(req, res) {  
    res.status(200).json(req.user);
    });
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/addStock', authenticate, function(req, res){
        var sym = req.query.sym;
        var amount = req.query.amount;
        console.log("adding "+ sym );
        console.log("user id:"+req.user.id);
        User.findByIdAndUpdate(req.user.id, 
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
                res.status(200);
            }
        })

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

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}