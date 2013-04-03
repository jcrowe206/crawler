var save = function(data, db, collection, callback) {
    // create a default value for callback if none provided
    callback = callback || function () {};
    var err = null;

    try {
        // if the provided collection is valid
        if (db[collection]) {
            // do an insert of the data
            db[collection].insert(data, function(err, resp){
                if (err) {
                    console.log("ERROR WHEN TRYING TO SAVE THE PAGE: " + err);
                } else {
                    console.log("saved the page: ");
                }
                // perform the callback
                callback(err, resp);
            });
        } else {
            err = "INVALID DB OBJECT PROVIDED. " + collection + " MUST BE A COLLECTION";
            callback(err, null);
        }
    } catch (err) {
        err = "ERROR THROWN: " + err;
        callback(err, null);
    }
}

module.exports = {
    save : save
}