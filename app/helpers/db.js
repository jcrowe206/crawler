var mongojs = require('mongojs'),
    databaseUrl = "mongodb://app_credibility:app_credibility@ds043027.mongolab.com:43027/cred_score_gatherer",
    collections = ["pages", "processed_pages", "raw_html", "second_level_raw_html", "processed_html"];

// create a connection to the mongo db and return it
exports.connection = function() {
    return mongojs.connect(databaseUrl, collections);
}