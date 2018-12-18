// config/database.js
module.exports = {

    url : 'mongodb://localhost:27017/pickleRisk', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    options:
    {
        useNewUrlParser : true,
        useMongoClient: true
    }
};
 