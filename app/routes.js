// app/routes.js
let request = require('request')

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
            return (pErr, pReq, pBody) => {
                if (pErr) {
                    console.log (pErr);
                    console.log ("Could not retrieve data from pickleRisk for: " + symbols);
                    return;
                }

                console.log('Received multidata from pickleRisk for ' + symbols);
                responseObj.json(JSON.parse(pBody))
            }
        })(req.query.symbols, res));
    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        //res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : 'http://localhost:3002/', // redirect to the secure profile section
        failureRedirect : 'http://localhost:3002/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

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