var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');

var multiparty = require('multiparty');
var sqlite3 = require('sqlite3');

var mime = require('./src/mime.js');
var results = require('./src/results.js');

var port = 8025;
var public_dir = path.join(__dirname, 'public');

var server = http.createServer((req, res) => {
    var req_url = url.parse(req.url);
    var filename = req_url.pathname.substring(1);
    if (filename === '') filename = 'index.html';

    if (req.method === 'GET'){
        fs.readFile(path.join(public_dir, filename), (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('File not found');
                res.end();
            }
            else {
                var ext = path.extname(filename).substring(1);
                res.writeHead(202, {'Content-Type': mime.mime_types[ext] || 'text/plain'});
                res.write(data);
                res.end();
            }
        });
    }
    else if (req.method === 'POST'){
        if (filename === 'results'){
            var form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
                console.log(err, fields, files);

                var response = results.generateResponse(fields);

                fs.readFile(path.join(public_dir, "results.html"), (err, data) => {
                    if (err){
                        console.log("Error in results: " + err);
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data);
                        res.end();
                    }

                });
            });
        }
    }
});

console.log('Listening on port ' + port);
server.listen(port, '0.0.0.0');
