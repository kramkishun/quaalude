const multidata = require('express').Router();
let request = require('request')
// BUG: any kind of unexpected response (e.g. HTML) causes crashes.

    multidata.get('/', (req, res) => {
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

module.exports = multidata;