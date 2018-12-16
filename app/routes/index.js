const routes = require('express').Router();
module.exports = function(passport) {

    routes.get('/', (req, res) => {
        res.send('Check out /tsdata');
    });

    const tsdata = require('./tsdata');
    routes.use('/tsdata', tsdata);

    const multidata = require('./multidata');
    routes.use('/multidata', multidata);

    const returndata = require('./returndata');
    routes.use('/returndata', returndata);

    const stats = require('./stats');
    routes.use('/stats', stats);

    const news = require('./news');
    routes.use('/news', news);

    return routes;
}