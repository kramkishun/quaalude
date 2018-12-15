// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name: String,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stocks:[{
        symble: String,
        amount: Number
    }]

},
{
    usePushEach: true
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('portfolio', userSchema);