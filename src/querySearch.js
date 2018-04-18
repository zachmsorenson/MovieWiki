// Parse POST message and query database
var sqlite3 = require('sqlite3');

function generateResponse(fields, callback){
    // value from search box and drop down
    var search = fields.search[0];
    var selection = fields.selection[0];

    //Remove all instances of (, ), and ; (do we need to remove quotes too?)
    search = search.replace(/[();]/g, '');
    console.log('search is:' + search);

    //We can create the query and send it to SQL
    if (selection === 'Titles'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_title=\"' + search + '\";';
    }else if (selection === 'Names'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_name=\"' + search + '\";';
    }

    console.log('Query: ' + query);

    // Query the database
    var objArray = [];
    var db = new sqlite3.Database("testDB.db", sqlite3.OPEN_READONLY);
    db.all(query, function(err, rows){
        if(err){
            console.log("ERROR in database query");
        } else {
            // Used to call promise.resolve
            callback(rows);
        }
    });


}
module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
