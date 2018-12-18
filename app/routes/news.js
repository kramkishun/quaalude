
const news = require('express').Router();
let News = require('../models/news');

    news.get('/:sym', (req, res) => {
        console.log ('News Request')
        News.find({ symbol: req.params.sym }).sort({dateLastRefreshed:-1}).limit(1).exec( (err, allNews) => { 
          if (err) return console.error(err);
          res.json(allNews[0]);
        });
    });
module.exports = news