var Queue = function() {
    // private variables
    var that = this;
    var activeQueue = [];
    var backlogQueue = [];
    var activelyProcessing = 0;
    var iterator = 0;

    // public variables
    this.maxJobSize = 10;

    // public methods
    // add a job to the queue
    this.add = function(url, fn, optionalParams) {
        // fn is the function we want to execute the url against
        fn = fn || function() {};
        // optional params becomes an array - you can pass as many optional params
        // in as you want and we will create an array
        optionalParams = Array().slice.call(arguments).splice(2);

        // if there is room in the activeQueue then let's add the job there
        // otherwise, let's put it in the backlog
        if (activeQueue.length <= this.maxJobSize) {
            activeQueue.push([url, fn, optionalParams]);
        } else {
            backlogQueue.push([url, fn, optionalParams]);
        }
    }


    // clear the currently active queue
    this.flushQueue = function() {
        activeQueue = [];
    }

    // run the active queue
    this.run = function() {
        var i; // iterator
        var processed = 0;
        var optionalParams; // initialize the optional params variable

        // loop through the active queue and run the provided function
        for (i = 0; i < activeQueue.length; i++) {
            // if we are already actively processing more than the limit then we will not do anything
            if (activelyProcessing > that.maxJobSize) {
                break;
            }
            // optional params will either be a provided value or an empty array
            optionalParams = activeQueue[i][2] || [];

            // Params will be the optional params concatenated with the required
            // argument and the queueCallback
            var params = [activeQueue[i][0]].concat(optionalParams);
            params.push(queueCallback);

            // run the function applying the constructed array params
            activeQueue[i][1].apply(that, params);

            // increment the activelyProcessing counter
            activelyProcessing++;

            // remove currently processing element
            that.dropFirst();
        }
    }

    // remove the first item from the activeQueue
    this.dropFirst = function() {
        activeQueue.shift();
    }


    // private methods
    // add jobs to open slots in the activeQueue
    function populateActive() {
        var apRemaining = that.maxJobSize - activelyProcessing;;
        var aqRemaining = that.maxJobSize - activeQueue.length;

        // if there are any jobs in the backlog
        if (backlogQueue.length && activelyProcessing < that.maxJobSize) {
            // get the limit by deducting the max job size and the current
            // number of jobs in the activeQueue
            var limit =  Math.min(apRemaining, aqRemaining);

            if (limit) {
                // remove the desired number of jobs from the backlog
                var newJobs = backlogQueue.splice(0, limit);

                // add the newly spliced jobs into the active Queue
                activeQueue = activeQueue.concat(newJobs);
            }
        }
    }

    function listen() {
        // Every 3 seconds check the queue
        setInterval(function(){
            console.log('nothing in the queue... waiting for jobs.');
            console.log(process.memoryUsage());
            // add workers to available activeQueue slots
            populateActive();
            that.run();
        }, 3000);
    }

    // the callback that will be run after every queue job processed
    function queueCallback(err, resp) {
//        that.dropFirst();
        activelyProcessing--;
    }

    // start listening for jobs
    listen();

}

module.exports.queue = new Queue();