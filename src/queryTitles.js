// Parse POST message and query database
var sqlite3 = require('sqlite3');

function generateResponse(html, id){
    // get rid of any non numbers in id
    search = search.replace(/[();]/g, '');

    ////////////////////
    // DATABASE STUFF
    ////////////////////
    // QUERY
    //
    //     SELECT       COLUMNS
    //     FROM        Titles
    //     FULL JOIN   Ratings ON Titles.tconst = Ratings.tconst
    //     FULL JOIN   Principals ON Titles.tconst = Principals.tconst
    //     FULL JOIN   Crew ON Titles.tconst = Principals.tconst
    //     ORDER BY    Principals.Ordering;
    //
    // FIGURE OUT ALL TABLE JOINING STUFF

    var query = 'SELECT *';

    // Query the database
    var objArray = [];
    var db = new sqlite3.Database("testDB.db", sqlite3.OPEN_READONLY);
    return new Promise((resolve, reject) => {
        db.all(query, function(err, rows){
            if(err){
                reject(err);
            } else {
                // on query success -> add rows as li's into html - create one string
                if (selection === 'Titles'){
                    var str = parseTitlesRows(rows);
                } else if (selection === 'Names') {
                    var str = parseNamesRows(rows);
                }
                var responseData = html.toString().replace("{{RESULT}}", str);
                console.log(responseData);
                resolve(responseData);
            }
        });
    });

}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
