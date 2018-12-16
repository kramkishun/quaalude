const tsdata = require('express').Router();
let request = require('request')
    // Right now just serving as a pass through
    // TODO: very repetitive from when proving out - refactor to remove duplicate code
    tsdata.get('/:sym', (req, res) => {

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

module.exports = tsdata;