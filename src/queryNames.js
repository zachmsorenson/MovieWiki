// Parse POST message and query database
var sqlite3 = require('sqlite3');

function generateResponse(html, id) {
    // get rid of any non numbers in id
    id = id.replace(/[();]/g, '');

    ////////////////////
    // DATABASE STUFF
    ////////////////////
    // QUERY
    //
    // SELECT * FROM Names WHERE nconst=id

    var query = 'SELECT * FROM Names WHERE nconst=\"' + id + '\";';

    // Query the database
    var objArray = [];
    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READONLY);
    return new Promise((resolve, reject) => {
        db.get(query, function (err, row) {
            if (err) {
                reject(err);
            } else {
                // on query success -> add rows as li's into html - create one string
                var str = parseNamesRow(row);
                var responseData = html.toString().replace("{{PERSON}}", str);
                console.log(responseData);
                resolve(responseData);
            }
        });
    });
}

function parseNamesRow(row){
    var str = "";
    console.log(row);
    str += "<p>";
    str += row.primary_name + " - ";
    str += row.birth_year + " - ";
    str += (row.death_year || "Present");
    str += row.primary_professions;
    str += "</p>";
    return str;
}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
