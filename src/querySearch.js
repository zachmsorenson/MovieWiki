// Parse POST message and query database
var sqlite3 = require('sqlite3');

function generateResponse(html, search, selection, filter){
    //Remove all instances of (, ), and ; (do we need to remove quotes too?)
    search = search.replace(/[();]/g, '');
    search = search.replace(/[*]/g, '%');
    console.log("html is " + html);
    console.log('search is:' + search);

    //We can create the query and send it to SQL
    if (selection === 'Titles'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_title LIKE \"' + search + '\"';
        if (filter) {
            query += ' AND title_type=\'' + filter + '\'';
        }
        query += ';';
    }else if (selection === 'Names'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_name LIKE \"' + search + '\"';
        if (filter) {
            query += ' AND primary_profession LIKE \'%' + filter + '%\'';
        }
        query += ';';
    }

    console.log('Query: ' + query);

    // Query the database
    var objArray = [];
    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READONLY);
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
                var responseData = html.toString().replace("{{RESULTS}}", str);
                console.log(responseData);
                resolve(responseData);
            }
        });
    });
}

function parseTitlesRows(rows) {
    var str = "";
    var template = 
    rows.forEach(function (row) {
        str += "<li>";
        str += "<a href='/titles.html?id=" + row.tconst + "\'>";
        str += row.primary_title + " - ";
        str += row.title_type + " - ";
        str += row.start_year;
        if (row.end_year) {
            str += " - " + row.end_year;
        }
        str += "</a>";
        str += "</li>";
    });
    return str;
}

function parseNamesRows(rows){
    var str = "";
    rows.forEach(function(row) {
        console.log(row);
        str += "<li>";
        str += "<a href='/people.html?id=" + row.nconst + "\'>";
        str += row.primary_name + " - ";
        str += row.birth_year + " - ";
        str += (row.death_year || "Present");
        str += " - " + row.primary_profession;
        str += "</a>";
        str += "</li>";
    });
    return str;
}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
