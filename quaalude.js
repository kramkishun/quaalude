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

app.listen(port, () => console.log(`Quaalude launched on port ${port}!`));
