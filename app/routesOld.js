// app/routes.js
let request = require('request')
// load up the user model
let News = require('./models/news');


var Portfoilo = require('./models/portfolio');
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


    app.put('/Portfolio:name', authenticate, function(req,res){

        var newPortfolio = new Portfoilo();

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
        Portfoilo.findById(ID).
            populate('createdBy').exec(function (err, portfoilo)
           {
               if(err){
                   console.log("no user associated with this portfoio");
                   return done(err);
               }
               if(portfoilo.createdBy._id == req.user.id)
               {
                   //add stock
                   var stock = {symble: sym,amount: amount};
                   portfoilo.stocks.push(stock);
                   portfoilo.save(function(err) {
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
