const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
var mongoose = require('mongoose');
var passport = require('passport');
var cors     = require('cors');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');

// Run with (nodemon):
// > npm start
//
// Run tests and coverage with
// > npm test

var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

app.use(passport.initialize());


// routes ======================================================================
const routes = require('./app/routes');
require('./app/routesOld.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/', routes(passport));

// Connection to Mongo
let initializeMongoose = () => {
  mongoose.connect(configDB.url,configDB.options);
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', () => {
    console.log('Connected to MongoDB through Mongoose');
  });
};

initializeMongoose();
// launch ======================================================================
let server = app.listen(PORT, () => console.log(`Quaalude launched on port ${PORT}!`));

// Exports for testing
module.exports = server;
module.exports.stop = () => { 
  server.close(); 
  mongoose.connection.close(); 
} 
