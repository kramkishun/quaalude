
const stats = require('express').Router();
let Stats = require('../models/stats');

stats.get('/:sym', (req, res) => {
    console.log ('Stats Request')
    Stats.find({ symbol: req.params.sym }).sort({dateLastRefreshed:-1}).limit(1).exec( (err, allStats) => { 
      if (err) return console.error(err);
      res.json(allStats[0]);
    });
});

module.exports = stats