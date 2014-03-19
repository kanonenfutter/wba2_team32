var http = require('http');

var planeten =  [['Erde', '12800', '149600000'],
                ['Mars', '6800', '227900000'],
                ['Venus', '12100', '108200000'],
                ['Merkur', '4900', '57910000'],
                ['Jupiter', '143000', '778500000'],
                ['Saturn', '120500', '1433000000'],
                ['Uranus', '51100', '2877000000']];




http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<head><title>Planeten der Milchstrasse</title></head>');
    res.write('<body><h2>Unsere Planeten</h2><table><tr><th>Planetenname</th><th>Durchmesser</th><th>Entfernung zur Sonne</th></tr>');
              
        for (var i = 0; i < 7; i++) {
        res.write('<tr>');
        for (var j = 0; j < 3; j++) {
            res.write('<td>');
            res.write(planeten[i][j]);
            
            res.write('</td>');
        }
        res.write('</tr>');
    }
    res.write('</body>');
    res.end();
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');