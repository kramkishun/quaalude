let mongoose = require('mongoose');

let statsEntrySchema = new mongoose.Schema ( {
    companyName : String,
    marketcap : String,
    beta : String,
    week52high : String,
    week52low : String,
    week52change : String,
    shortInterest : String,
    shortDate : String,
    dividendRate : String,
    dividendYield : String,
    exDividendDate : String,
    latestEPS : String,
    latestEPSDate : String,
    sharesOutstanding : String,
    float : String,
    returnOnEquity : String,
    consensusEPS : String,
    numberOfEstimates : String,
    symbol : String,
    EBITDA : String,
    revenue : String,
    grossProfit : String,
    cash : String,
    debt : String,
    ttmEPS : String,
    revenuePerShare : String,
    revenuePerEmployee : String,
    peRatioHigh : String,
    peRatioLow : String,
    EPSSurpriseDollar : String,
    EPSSurprisePercent : String,
    returnOnAssets : String,
    returnOnCapital : String,
    profitMargin : String,
    priceToSales : String,
    priceToBook : String,
    day200MovingAvg : String,
    day50MovingAvg : String,
    institutionPercent : String,
    insiderPercent : String,
    shortRatio : String,
    year5ChangePercent : String,
    year2ChangePercent : String,
    year1ChangePercent : String,
    ytdChangePercent : String,
    month6ChangePercent : String,
    month3ChangePercent : String,
    month1ChangePercent : String,
    day5ChangePercent : String
})
let statsSchema = new mongoose.Schema({ 
    symbol: String,
    dateLastRefreshed: String,
    entry: statsEntrySchema
});
  
let Stats = mongoose.model('Stats', statsSchema, 'keyStats');

module.exports = Stats;