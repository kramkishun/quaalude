let mongoose = require('mongoose');

let newsEntrySchema = new mongoose.Schema( {
    datetime : String,
    headline : String,
    source : String,
    url : String,
    summary : String,
    related : String,
    image : String
});
  
let newsSchema = new mongoose.Schema( {
    symbol: String,
    dateLastRefreshed: String,
    entry: [newsEntrySchema]
});
  
let News = mongoose.model('News', newsSchema, 'news');

module.exports = News;
