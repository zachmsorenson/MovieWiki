// Parse POST message and query database
var sqlite3 = require('sqlite3');

function generateResponse(html, id){
    // get rid of any non numbers in id
    id = id.replace(/[();]/g, '');

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

    var query = 'SELECT * FROM Titles JOIN Ratings ON Titles.tconst=Ratings.tconst' +
        ' JOIN Crew ON Titles.tconst=Crew.tconst' +
        ' WHERE Titles.tconst=\'' + id + '\';';

    // Query the database
    console.log('Sending Query: ' + query);
    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READONLY);
    return new Promise((resolve, reject) => {
        db.get(query, function(err, row){
            if(err){
                reject(err);
            } else {
                console.log('successful query for title!');
                console.log(row);
                // on query success -> add rows as li's into html - create one string
                parseTitleRow(html, row)
                    .then(data => {
                        var responseData = data;
                        //console.log(responseData);
                        resolve(responseData);
                    });
            }
        });
    });
}

function parseTitleRow(html, row){
    // will have to make some kind of query to get some amount of people
    //var names = row.top_billed.split(',');
    var query = 'SELECT Names.nconst, Names.primary_name, Principals.category FROM Titles JOIN ' +
        'Principals ON Principals.tconst=Titles.tconst JOIN ' +
        'Names ON Names.nconst=Principals.nconst WHERE ' +
        'Titles.tconst=\'' + row.tconst + '\';';
    console.log(row);
    console.log(query);
    var db = new sqlite3.Database("imdb.sqlite3", sqlite3.OPEN_READONLY);
    return new Promise((resolve, reject) => {
        console.log('before query');
        db.all(query, function(err, nameRows){
            console.log('query submitted');
            if (err) {
                console.log('fell in error');
                console.log(err);
                reject(err);
            } else { // success on name queries
                // put data into html template
                var response = html.toString();
                response = response.replace('{{TITLE}}', row.primary_title);
                response = response.replace('{{TITLE_TYPE}}', row.title_type);
                response = response.replace('{{START_YEAR}}', row.start_year);
                response = response.replace('{{END_YEAR}}', row.end_year || "");
                response = response.replace('{{IMG}}', row.tconst);

                response = response.replace('{{RUNTIME_MINUTES}}', row.runtime_minutes);
                response = response.replace('{{GENRES}}', row.genres);
                response = response.replace('{{AVERAGE_RATING}}', row.average_rating);
                response = response.replace('{{NUM_VOTES}}', row.num_votes);
                var top_billed = "";
                var link = "/people.html?id="
                for (i=0; i < nameRows.length; i++) {
                    top_billed += "<li><a href=\'" + link + nameRows[i].nconst + '\'>' +
                        nameRows[i].primary_name + "</a></li>";
                }
                response = response.replace('{{TOP_BILLED}}', top_billed);
                resolve(response);
            }
        });
    });
}

//
// [ { nconst: 'nm0179163',
//     primary_name: 'James J. Corbett',
//     category: 'actor' },
//     { nconst: 'nm0183947',
//         primary_name: 'Peter Courtney',
//         category: 'actor' },
//     { nconst: 'nm0005690',
//         primary_name: 'William K.L. Dickson',
//         category: 'director' } ]
//

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
