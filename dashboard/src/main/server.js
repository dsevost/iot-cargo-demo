var ipaddress = "0.0.0.0";
var port = 8080;

var http = require('http');

var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');

//app.use(express.static(path.join(__dirname, 'webapp'))); 
app.use(express.static(__dirname));
app.use(logger('dev'));

app.get('/js/env.js', function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.end('\n\
(function (window) {\n\
  window.__APP_CONFIG = window.__APP_CONFIG || {};\n\
\n\
  window.__APP_CONFIG = {\n\
    EDC_USERNAME: ' + "'" + (process.env.EDC_USERNAME || '') + "'" + ',\n\
    EDC_PASSWORD: ' + "'" + (process.env.EDC_PASSWORD || '') + "'" + ',\n\
    EDC_REST_ENDPOINT: ' + "'" + (process.env.EDC_REST_ENDPOINT || 'https://api-sandbox.everyware-cloud.com/v2') + "'"  + ',\n\
    JDG_REST_ENDPOINT: ' + "'" + (process.env.JDG_REST_ENDPOINT || 'http://localhost:8080/dgproxy/rest') + "'" + ',\n\
    GOOGLE_MAPS_API_KEY: ' + "'" + (process.env.GOOGLE_MAPS_API_KEY || '') + "'" + ',\n\
    DEMO_ASSET: ' + "'" + (process.env.DEMO_ASSET || 'demo-gw-vm') + "'" +'\n\
  }\n\
}(this));\n\
    ');
});

var server = http.createServer(app);

server.listen( port, ipaddress, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});


console.log("Listening to " + ipaddress + ":" + port + "...");
