let request = require('request')

const express = require('express');
const app = express();
const port = 3001;

let mongoose = require('mongoose');
let News = require('./models/news');
let Stats = require('./models/stats');

// launch with:
// > node quaalude.js

// Connection to Mongo
let initializeMongoose = () => {
  mongoose.connect('mongodb://localhost:27017/pickleRisk', { useNewUrlParser: true} );
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', () => {
    console.log('Connected to MongoDB through Mongoose');
  });
};

initializeMongoose();

// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Endpoints
app.get('/', (req, res) => res.send('Check out /tsdata'));

// TODO: very repetitive from when proving out - refactor to remove duplicate code
app.get('/tsdata/:sym', (req, res) => {

  const pickleRisk = 'http://localhost:5000/history/' + req.params.sym;

  // TODO: replace with fetch or axios - this pattern is terrible for readability.
  request(pickleRisk, ((symbol, responseObj) => {
    return (pErr, pReq, pBody) => {
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
    }
  })(req.params.sym, res));
});

app.get('/multitsdata', (req, res) => {
  console.log ('Multi Symbol Request')

  const pickleRisk = 'http://localhost:5000/multihistory?symbols=' + req.query.symbols;

  request(pickleRisk, ((symbols, responseObj) => {
    return (pErr, pReq, pBody) => {
      try {
        if (pErr) {
          console.log (pErr);
          console.log ("Could not retrieve data from pickleRisk for: " + symbols);
          return;
        }

        console.log('Received multidata from pickleRisk for ' + symbols);
        responseObj.json(JSON.parse(pBody))
      } catch (e) {
        console.log(e);
      }
    }
  })(req.query.symbols, res));
});

app.get('/returndata/:sym', (req, res) => {
  console.log ('Return Request')

  const pickleRisk = 'http://localhost:5000/returns/' + req.params.sym;

  request(pickleRisk, ((symbols, responseObj) => {
    return (pErr, pReq, pBody) => {
      try {
        if (pErr) {
          console.log (pErr);
          console.log ("Could not retrieve return data from pickleRisk for: " + symbols);
          return;
        }

        console.log('Received return from pickleRisk for ' + symbols);
        responseObj.json(JSON.parse(pBody))
      } catch (e) {
        console.log(e);
      }
    }
  })(req.params.sym, res));
});

app.get('/stats/:sym', (req, res) => {
  console.log ('Stats Request')
  Stats.find({ symbol: req.params.sym }).sort({dateLastRefreshed:-1}).limit(1).exec( (err, allStats) => { 
    if (err) return console.error(err);
    res.json(allStats[0]);
  });
});

app.get('/news/:sym', (req, res) => {
  console.log ('News Request')
  News.find({ symbol: req.params.sym }).sort({dateLastRefreshed:-1}).limit(1).exec( (err, allNews) => { 
    if (err) return console.error(err);
    res.json(allNews[0]);
  });
});


app.listen(port, () => console.log(`Quaalude launched on port ${port}!`));
