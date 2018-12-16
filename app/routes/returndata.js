const returndata = require('express').Router();
let request = require('request')

returndata.get('/:sym', (req, res) => {
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

module.exports = returndata;