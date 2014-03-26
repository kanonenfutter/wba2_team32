var express = require('express');
var app2 = express();

var planeten = 
[
{ "Pname":"Erde" , "Du":"12800" , "Dist":"149600000" },
{ "Pname":"Mars" , "Du":"6800" , "Dist":"227900000" },
{ "Pname":"Venus" , "Du":"12100" , "Dist":"108200000"}
];

app2.use(express.static(__dirname+'/public'));
app2.use(express.json());
app2.use(express.urlencoded());

app2.get('/planeten', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}, "OK");
    res.write('<head><title>Planeten der Milchstrasse</title></head>');
    res.write('<body><h2>Unsere Planeten</h2><table><tr><th>Planetenname</th><th>Durchmesser</th><th>Entfernung zur Sonne</th></tr>');
              
    for (var i = 0; i < planeten.length; i++) {
        res.write('<tr>');
        
        res.write('<td>');
        res.write(planeten[i].Pname);
        res.write('</td>');
        res.write('<td>');
        res.write(planeten[i].Du);
        res.write('</td>');
        res.write('<td>');
        res.write(planeten[i].Dist);
        res.write('</td>');
        
        res.write('</tr>');
    }
    
    res.write('</table>');
    res.write('</body>');
    res.end();
}); 
    
app2.listen(3000);
    