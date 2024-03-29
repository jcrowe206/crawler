var request    = require('request'),
    $ = jQuery = require('jquery');

module.exports = function(url, callback, queueCallback) {
    var callbackHtml = null;
    callback         = callback || function () {};
    queueCallback    = queueCallback || function () {};

    request(url, function(err, resp, body) {
        if (err) {
            callback(err);
        } else {
            try {
                if (resp.statusCode == 200) {
                    callbackHtml = $(resp.body).html();
                } else {
                    err = "could not fetch site. Received response code: " + resp.statusCode;
                }
            } catch (error) {
                err = "caught an error on line 20 of crawl.js";
            }

            console.log(process.memoryUsage());

            callback(err, callbackHtml);
            queueCallback();
        }
    });
}
