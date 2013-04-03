// node modules
var async        = require('async'),
    $ = jquery   = require('jquery'),
    net          = require('net'),
    request      = require('request');

// custom modules
var crawl        = require(__dirname + '/app/classes/crawl.js'),
    db           = require(__dirname + '/app/helpers/db.js').connection(),
    pageMapper   = require(__dirname + '/app/models/pageMapper.js'),
    queue        = require(__dirname + '/app/classes/queue.js').queue,
    urlHelper    = require(__dirname + '/app/helpers/url.js');

// local variables
var html         = null,
    processed    = 0,
    addedToQueue = 0,
    hostname     = "www.dandb.com";


var url = 'http://www.dandb.com/';

// make a request to the url param
request(url, function(err, resp, body){
    html = [];
    // add the html to the html array
    html.push($(resp.body).html());

    // self invoking function to get all links
    (function getLinksFromHtml(html) {
        // grab all links from the html using Jquery
        var allLinks = $(html).find('a');
        // iterate through all links and add them to the queue
        allLinks.each(function(){
            addedToQueue++; // keep track of how many links we have added to queue
            // add the link to the queue to be processed as workers open up
            queue.add(urlHelper.concatenateInternalLinkWithBase($(this).attr('href'), hostname), crawl, storeHtml);
        })

    })($(resp.body).html());
})

// receive the callback from the crawl function
var storeHtml = function (err, resp) {

    if (err) {
        console.log(err);
    }

    // we got data back from the function
    if (resp) {
        // show that we have the data
        console.log("pushing html of " + resp.length + " characters long");
        // add the data to the html array to be saved later
        html.push(resp);
    }

    // if we have processed all of the jobs that were added to the queue
    if (++processed == addedToQueue) {
        // save the html array in the page_html collection using the db connection
        pageMapper.save({url : hostname, data : html }, db, 'raw_html', function(err, resp){
            if (err) {
                console.log(err);
            }
            console.log('saved page mapper data');
            console.log(process.memoryUsage());
            // garbage collection
            html = null;

            console.log(process.memoryUsage());
        })
    }
}