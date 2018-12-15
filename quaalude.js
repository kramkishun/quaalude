const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var cors     = require('cors');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');


var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// launch with:
// > node quaalude.js
app.use(cors());

// required for passport
//app.use(session({ secret: 'MethaqualoneMandraxQuinazolinone' })); // session secret
app.use(passport.initialize());
//TODO: not useing session should remove
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(PORT);
console.log('Mandrax launched on port' + PORT);

//app.listen(port, () => console.log(`Quaalude launched on port ${port}!`));
