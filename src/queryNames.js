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
                parseNamesRow(html, row)
                    .then(data => {
                        resolve(data);
                    });
            }
        });
    });
}

function parseNamesRow(html, row){
    // Will have to make another query to get known_for_titles
    var titles = row.known_for_titles.split(',');
    var query = 'SELECT * FROM Titles WHERE tconst=\'' + titles[0] + '\'';
    for (i = 0; i < titles.length; i++){
        query += ' OR tconst=\'' + titles[i] + '\'';
    }
    query += ';';

    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READONLY);
    return new Promise((resolve, reject) => {
        db.all(query, function(err, titleRows) {
            if (err) {
                reject(err);
            } else {
                var response = html.toString();
                response = response.replace("{{NAME}}", row.primary_name);
                response = response.replace("{{BIRTH_YEAR}}", row.birth_year);
                response = response.replace("{{DEATH_YEAR}}", row.death_year || "Present");
                response = response.replace("{{PROFESSIONS}}", row.primary_profession);
                var known_for_html = "";
                for (i=0; i < titleRows.length; i++){
                    known_for_html += "<li>" + titleRows[i].primary_title + "</li>";
                }
                response = response.replace("{{KNOWN_FOR}}",known_for_html);
                response = response.replace("{{IMG}}", row.nconst);
                resolve(response);
            }
        });
    });
}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
