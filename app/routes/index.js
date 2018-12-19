const routes = require('express').Router();
const loginMW = require('./logonMiddleware');

module.exports = function(passport) {

    routes.get('/', (req, res) => {
        res.send('Check out /tsdata');
    });

    const tsdata = require('./tsdata');
    routes.use('/tsdata', tsdata);

    const multidata = require('./multidata');
    routes.use('/multitsdata', multidata);

    const returndata = require('./returndata');
    routes.use('/returndata', returndata);

    const stats = require('./stats');
    routes.use('/stats', stats);

    const news = require('./news');
    routes.use('/news', news);

    const logon = require('./logon')(passport);
    routes.use('/logon', logon);
    routes.use('/logon', loginMW.serialize);
    routes.use('/logon', loginMW.generateToken);
    routes.use('/logon', loginMW.respond);

    const signup = require('./signup')(passport);
    routes.use('/signup', signup);
    routes.use('/signup', loginMW.serialize);
    routes.use('/signup', loginMW.generateToken);
    routes.use('/signup', loginMW.respond);

    return routes;
}