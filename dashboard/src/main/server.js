var ipaddress = "0.0.0.0";
var port      = 8080;

var http = require('http');

var express = require('express');
var app = express();

var server = http.createServer(app);
//var server = http.createServer(function(request, response) {
app.get('/', function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("Welcome to Node.js on OpenShift!\n\n");
  response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
  console.log((new Date()) + ' Server is listening on port ' + port);
});


console.log("Listening to " + ipaddress + ":" + port + "...");
