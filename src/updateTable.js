// Parse POST message and query database
var sqlite3 = require('sqlite3');

function updateTable(table, column, value, id){

    if (table == 'Titles'){
        var query = 'UPDATE ' + table + ' SET ' + column + '=\'' + value + '\' WHERE tconst=\'' + id + '\';';
    } else {
        var query = 'UPDATE ' + table + ' SET ' + column + '=\'' + value + '\' WHERE nconst=\'' + id + '\';';
    }

    console.log(query);
    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READWRITE);
    db.run(query);
}

module.exports = {};
module.exports.updateTable = updateTable;
module.exports.version = '0.0.0';