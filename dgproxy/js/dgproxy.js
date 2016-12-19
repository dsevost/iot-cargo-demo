var ipaddress = "0.0.0.0";
var port = 8081;

var express = require('express');
var http = require('http');
var jdg = require('infinispan');
var logger = require('morgan');
var path = require('path');

var JDG_VERSION = process.env.JDG_HOTROD_PROTOCOL_VERSION || '2.2';
var CACHE_NAME = process.env.JDG_CACHE_NAME || 'default';

var JDG_SERVICE_NAME = process.env.JDG_SERVICE_NAME || 'IOT_DATAGRID';

var jdgHost = eval('process.env.' + JDG_SERVICE_NAME +'_HOTROD_SERVICE_HOST');
var jdgPort = eval('process.env.' + JDG_SERVICE_NAME +'_HOTROD_SERVICE_PORT');

var jdgConnection = jdg.client(
  { host: jdgHost, port: jdgPort },
//  { cacheName: CACHE_NAME },
  { version: JDG_VERSION }
);

var jdgClient;
var server;

jdgConnection.then(function(client) { 
  jdgClient = client;
  server = http.createServer(app);
  server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
  });
});

var app = express();
app.use(logger('dev'));

var router = express.Router();
app.use('/dgproxy/rest', router);

router.route('/rhiot/:id')
  .get(function(request, response) {
    var id = request.params.id;
    console.log('get:route(/rhiot/:' + id + ')');
    jdgClient.get(request.params.id).then(
      function(result) {
        console.log('get:route(/rhiot/:' + id + ') = ' + result);
        if(!result) {
//          response.writeHead(404, {'Content-Type': 'text/plain'});
//          response.end('Key "' + id + '" not found\n');
          response.writeHead(200, {'Content-Type': 'applicaiton/json'});
          response.end('');
          return;
        }
        response.writeHead(200, {'Content-Type': 'applicaiton/json'});
        response.write(result);
        response.end('\n');
      })
  })
  .put(function(request, response) {
    var id = request.params.id;
    console.log('put:/route(/rhiot/:' + id + ')');
    console.log('put:/route(/rhiot/:' + id + '), body: ' + JSON.stringify(request));
    jdgClient.put(request.params.id, request).then(
      function(result) {
        console.log('get:route(/rhiot/:' + id + ') = ' + result);
        if(!result) {
          response.writeHead(403, {'Content-Type': 'text/plain'});
          response.end('Upload for key "' + id + '" failed ' + result + '\n');
          return;
        }
        response.writeHead(200, {'Content-Type': 'applicaiton/json'});
        response.end('{}\n');
      })
  })
;