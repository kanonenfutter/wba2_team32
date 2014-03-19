￼var http = require('http');
var querystring = require('querystring'); var url = require('url');

var server = http.createServer();

server.on('request', function(req, res){ 
  console.log('HTTP-Request gestartet')
console.log('HTTP-Methode: '+req.method); var body = '';
req.on('data', function(data){ body = body + data.toString();
});
req.on('end', function(){ console.log('HTTP-Request zu Ende'); var daten = querystring.parse(body); var pfad = url.parse(req.url).pathname;
console.log('Pfad: '+pfad); console.log(daten);
res.writeHead(200, "OK", {'Content-Type': 'text/html'}); res.write('Hallo '+ daten.name);
res.end();
 });
￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼

￼￼￼￼￼￼});
￼
server.listen(8888); 