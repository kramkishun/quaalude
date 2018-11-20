let request = require('request')

const express = require('express');
const app = express();
const port = 3001;


// launch with:
// > node quaalude.js

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.send('Check out /tsdata'));

// Right now just serving as a pass through
app.get('/tsdata/:sym', (req, res) => {

  const pickleRisk = 'http://localhost:5000/history/' + req.params.sym;

  request(pickleRisk, (getErr, getRes, getBody) => {
    if (getErr) {
      console.log (getErr);
      console.log ("Could not retrieve data from pickleRisk for: " + req.param.sym);
      return;
    }

    console.log ("Received data from pickleRisk for " + req.param.sym);

    datesAndCloses = JSON.parse(getBody);
    res.json(datesAndCloses);
  });

  // return array of 40 random numbers
  //let randomData = Array(40).fill().map(() => Math.round(Math.random() * 40));
  //res.json(randomData);
});

app.listen(port, () => console.log(`Quaalude launched on port ${port}!`));
