var marklogic = require('marklogic'),
    fs = require('fs');

// Load into localhost:8000
var db = marklogic.createDatabaseClient({
  user: 'admin',
  password: 'admin'
});

//
var triplesPath = 'xml/', // 'xml/' or 'n3/'
    triplesType = 'application/rdf+xml', // 'application/rdf+xml' or 'text/n3'
    triplesFiles = fs.readdirSync(triplesPath);

function loadTriples() {

  var currFile = triplesFiles.shift(),
      buffer = fs.readFileSync(triplesPath + currFile);
  db.graphs.write({
    contentType: triplesType,
    data: buffer
  }).result(
    function(response) {
      if (triplesFiles.length > 0) {
        console.log('Triples loaded');
        loadTriples();
      } else {
        console.log('Loading done');
      }
    },
    function(error) { console.log(JSON.stringify(error)); }
  );

}

loadTriples();
