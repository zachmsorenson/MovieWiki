var express = require('express');

var url = require('url');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var querySearch = require('./src/querySearch.js');
var queryTitles = require('./src/queryTitles.js');
var queryNames = require('./src/queryNames.js');

var app = express();
var port = 8025;


app.use('/css', express.static(path.join(__dirname + '/public/css')));
app.use('/js', express.static(path.join(__dirname + '/public/js')));
app.use('/images', express.static(path.join(__dirname + '/public/images')));

app.get('/', (req, res) => { //request to index page
    var req_url = url.parse(req.url);
    console.log(req_url);
    fs.readFile('public/index.html', (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Could not find file!');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    });
});

app.get('/about.html', (req, res) => {
    fs.readFile('public/about.html', (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Could not find file');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    });
});

app.get('/search', (req, res) => { //request to search page
    console.log(req.url);
    var req_url = url.parse(req.url);
    var selection = req.query.selection;
    var search = req.query.search || ""; // if search empty default to empty string

    if (!(selection)) { // query not specified
        fs.readFile('public/searchResults.html', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Could not find file!');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    } else { // do query, serve dynamic html
        fs.readFile('public/searchResults.html', (err, data) => {
            querySearch.generateResponse(data, search, selection)
                .then(data => {
                    // successfully queried data and received templated html - return data
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                })
                .catch(error => console.log(error));



            //console.log(html);
        });
    }
});

app.get('/titles.html', (req, res) => {
    var req_url = url.parse(req.url);
    var id = req.query.id || "";

    if (!(id)) { // no id specified

    } else { // given id - do query and send back result
        fs.readFile('public/titles.html', (err, data) => {
            queryTitles.generateResponse(data, id)
                .then(data => {
                    //successfully queried database and received templated html for title page
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                });
        });
    }
});

app.get('/people.html', (req, res) => {
    var req_url = url.parse(req.url);
    var id = req.query.id || "";

    if (!(id)) { // no id specified

    } else { // given id - do query and send back result
        fs.readFile('public/people.html', (err, data) => {
            queryNames.generateResponse(data, id)
                .then(data => {
                    //successfully queried database and received templated html for person page
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                })
                .catch(error => console.log(error))
        });
    }
});


app.listen(port);