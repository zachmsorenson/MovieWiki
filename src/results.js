// Parse POST message, query database, generate HTML to send back
var sqlite3 = require('sqlite3');

function generateResponse(fields){
    // value from search box and drop down
    var search = fields.search[0];
    var selection = fields.selection[0];

    //Remove all instances of (, ), and ; (do we need to remove quotes too?)
    search = search.replace(/[();"]/g, '');

    //We can create the query and send it to SQL
    if (selection === 'Titles'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_title=\"' + search + '\";';
    }else if (selection === 'Names'){
        var query = 'SELECT * FROM ' + selection + ' WHERE primary_name=\"' + search + '\";';
    }

    console.log('Query: ' + query);

    ////////////////////////
    // QUERY DATABASE HERE
    ////////////////////////
    var db = new sqlite3.Database("testDB.db");
    db.each(query, function(err, row) {
        // For each row received from the query, parse it
        if(err){
            console.log("Error on database query: " + err);
        } else {
            parseRow(row);
        }
    });
    return "";

    ////////////////////////////////////
    // 1) Dynamically create entire html as string
    ////////////////////////////////////
    //Now we've gotten the rows we want from table, convert to HTML
    // var html = '<!DOCTYPE html><head><meta charset="UTF-8"><title>Results</title></head><body>';
    // //TESTING
    // for (i=0; i<10; i++){
    //     html += '<a src="results/Spiderman" style="color:blue; cursor:pointer; text-decoration:underline;">Spiderman<a/><br>';
    // }
    // html+='</body>';
    // //console.log(html);
    // return html;

    //////////////////////////////////
    // 2) Use app controller on results page with Angular
    //////////////////////////////////


}

function parseRow(row){
    // Put this row into the scope of our results page controller
    // var scope = angular.element($('#resultsList')).scope();
    // scope.$apply(function(){
    //     scope.results.push(row);
    // });
    console.log(row);
}

module.exports = {};
module.exports.generateResponse = generateResponse;
module.exports.version = '0.0.0';
