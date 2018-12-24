// app/routes.js
let request = require('request')
// load up the user model
let News = require('./models/news');


var Portfolio = require('./models/portfolio');
const jwt   = require('jsonwebtoken');

var secret = require('../config/settings.js');

const expressJwt = require('express-jwt');  
const authenticate = expressJwt(secret);

//todo.. each of these routes should be there own file with express.routs
module.exports = function(app, passport) {


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this 
    app.get('/profile', authenticate, function(req, res) {
        res.status(200).json(req.user);
    });

    app.get('/portfolio', authenticate, function(req, res) {
        Portfolio.find({},function(err,portfolios)
        {
        //    var portfolioMap = {};

        //    portfolios.forEach(function(portfolio) {
        //        portfolioMap[portfolio.name] = portfolio;
        //    });
        
            res.send(portfolios); 
        });
    });

    app.put('/Portfolio:name', authenticate, function(req,res){

        var newPortfolio = new Portfolio();


        // set the user's local credentials
        newPortfolio.name    = req.params.name;
        newPortfolio.createdBy = req.user.id;

        // save the portfolio
        newPortfolio.save(function(err) {
            if (err){
                console.log(err)
                throw err;
            }
            res.status(200).json({Status: 'Portfolio added '});
        });
        
    });

    app.post('/addStock', authenticate, function(req, res)
    {
        var sym = req.query.sym;
        var amount = req.query.amount;
        var ID = req.query.portfolioID
        console.log("adding "+ sym );
        console.log("user id:"+req.user.id);
        console.log("portfolio ID:" + ID);
        Portfolio.findById(ID).
            populate('createdBy').exec(function (err, portfolio)
           {
               if(err){
                   console.log("no user associated with this portfoio");
                   return done(err);
               }
               if(portfolio.createdBy._id == req.user.id)
               {
                   //add stock
                   var stock = {symble: sym,amount: amount};
                   portfolio.stocks.push(stock);
                   portfolio.save(function(err) {
                    if (err){
                        console.log(err)
                        throw err;
                    }
                    res.status(200).json({Status: 'Portfolio added '});
                });
               }
           });
    });
};
