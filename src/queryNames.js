// Parse POST message and query database
var sqlite3 = require('sqlite3');
var GetNamePoster = require('./imdb_poster.js').GetPosterFromNameId;
var GetTitlePoster = require('./imdb_poster.js').GetPosterFromTitleId;

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
                response = response.replace('{{ID}}', row.nconst);
                response = response.replace("{{NAME}}", row.primary_name);
                response = response.replace(/{{BIRTH_YEAR}}/g, row.birth_year);
                response = response.replace(/{{DEATH_YEAR}}/g, row.death_year || "Present");
                response = response.replace("{{PROFESSIONS}}", row.primary_profession);

                var promiseArray = [];
                var newPromise;
                // start promise to get imagedata
                var imglink = 'https://';
                newPromise = new Promise((resolve, reject) => {
                    console.log('main poster request');
                    console.log(row);
                    GetNamePoster(row, function(str, data){
                        console.log('got data');
                        console.log(data);
                        var obj = {'str': str, 'data': data};
                        resolve(obj);
                    });
                }).then(obj => {
                    console.log('resolved main promise');
                    console.log(obj);
                    if (obj.data){
                        imglink += obj.data.host + obj.data.path;
                        response = response.replace('{{IMG}}', imglink);
                    }
                });
                promiseArray.push(newPromise);


                //start known_for
                var known_for = "";
                var link = "/titles.html?id=";
                for (i=0; i < titleRows.length; i++) {
                    // get request for poster data - inside promise
                    console.log('making a promise');
                    newPromise = new Promise((resolve, reject) => {
                        GetTitlePoster(titleRows[i], function(str, data){
                            console.log('got data');
                            var obj = {'str': str, 'data': data};
                            resolve(obj);
                        });
                    }).then(obj => {
                        console.log(obj);
                        var data = obj.data;
                        var str = obj.str;
                        console.log('checkpoint a');
                        if (!str){
                            known_for += "<li class='list-card'><a href=\'" + link + data.row.tconst + '\'>' +
                                data.row.primary_title + "</a>";
                            known_for += "<img src=\"images/default-poster.jpeg\" data-src=\"https://" + data.host + data.path + "\"/>"
                        } else {
                            known_for += "<li>Title not found</li>";
                        }
                        console.log('checkpoint b');
                        known_for += "</li>";
                        console.log(promiseArray);
                    });
                    promiseArray.push(newPromise);
                }

                // we have our array of promises - on when all resolve then we can resolve(response)
                console.log(promiseArray);
                Promise.all(promiseArray).then(values => {
                    console.log('resolved all promises');
                    console.log(values);
                    response = response.replace('{{KNOWN_FOR}}', known_for);
                    resolve(response);
                });
                // // when imglink promise resolves, we can resolve the promise for the html page
                // promise.then(imglink => {
                //     if (imglink){
                //         console.log('fell in if');
                //         response = response.replace("{{IMG}}", imglink);
                //         resolve(response);
                //     } else {
                //         console.log('fell in else');
                //         response = response.replace("{{IMG}}", "images/default.png");
                //         resolve(response);
                //     }
                // });
            }
        });
    });
}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';

//
// GetPosterFromNameId(nconst, callback)
// GetPosterFromTitleId(tconst, callback)
// The callback should be a function with 1 parameter that holds the data for the poster image URL. Note that the data
// is a JavaScript object with host and path - you will need to create the actual URL for the <img> src attribute. The
// protocol (http:// or https://) should match that of your webpage. In the browser, this can be detected
// // using window.location.protocol.
