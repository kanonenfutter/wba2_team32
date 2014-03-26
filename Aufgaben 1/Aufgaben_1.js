var http = require('http');
var url = require('url');
var querystring = require('querystring');

var planeten =  [['Erde', '12800', '149600000'],
                ['Mars', '6800', '227900000'],
                ['Venus', '12100', '108200000'],
                ['Merkur', '4900', '57910000'],
                ['Jupiter', '143000', '778500000'],
                ['Saturn', '120500', '1433000000'],
                ['Uranus', '51100', '2877000000']];




var server = http.createServer();
    
server.on('request', function (req, res){
    
    if(url.parse(req.url).pathname == '/planeten') {
        
        console.log('HTTP-Request gestartet');
        console.log('HTTP-Methode: ' + req.method);
        var stringified = '';
    
        if (req.method == "POST") {
            req.on('data', function (data) {
                stringified += data.toString();
            });
        
            req.on('end', function () {
                console.log('HTTP-Request zu Ende');
                var daten = querystring.parse(stringified);
                console.log(daten);
            
                planeten[planeten.length] = [daten.Pname, daten.Du, daten.Dist];
            });
        }
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<head><title>Planeten der Milchstrasse</title></head>');
        res.write('<body><h2>Unsere Planeten</h2><table><tr><th>Planetenname</th><th>Durchmesser</th><th>Entfernung zur Sonne</th></tr>');
              
        for (var i = 0; i < planeten.length; i++) {
            res.write('<tr>');
            for (var j = 0; j < 3; j++) {
                res.write('<td>');
                res.write(planeten[i][j]);
                res.write('</td>');
            }
            res.write('</tr>');
        }
        res.write('<table>');
        res.write('<form name="form" action="http://127.0.0.1:8124/planeten">Planetenname<input name="Pname" type="text"></input><br>Durchmesser<input name="Du" type="text"></input><br>Entfernung zur Sonne<input name="Dist" type="text"></input><br><input type="submit" formmethod="post" value="Absenden"></input></form>');
        res.write('</body>');
        res.end();
    } 
    else {    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Falscher Pfad');
        res.end();}
    
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');
    
