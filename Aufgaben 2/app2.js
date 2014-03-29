//Notes: added http module, fixed json formating, changed table row code, added post
var http = require('http');
var express = require('express');
var app2 = express();


//Array mit JSON Objekte
var planeten = 
[
{ pname:'Erde' , du:12800 , dist:149600000 },
{ pname:'Mars' , du:6800 , dist:227900000 },
{ pname:'Venus' , du:12100 , dist:108200000}
];

//Verzeichnisdefinierung fuer den Zugriff von Aussen
app2.use(express.static(__dirname+'/public'));

//benötigt um Informationen des Requests zu parsen
app2.use(express.json());
app2.use(express.urlencoded());


//get-response auf die Ressource /planeten
app2.get('/planeten', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    //Schreibt den statischen Teil des html Dokuments: title, Ueberschrift und Tabellenkopf
    res.write('<head><title>Planeten der Milchstrasse</title></head>');
    res.write('<body><h2>Unsere Planeten</h2><table><tr><th>Planetenname</th><th>Durchmesser</th><th>Entfernung zur Sonne</th></tr>');
    //Tabelle wird des Arrays planeten geschrieben
    for (var i = 0; i < planeten.length; i++) {
        res.write('<tr><td>' + planeten[i].pname + '</td><td>' + planeten[i].du + '</td><td>' + planeten[i].dist + '</td></tr>');
    }
    
    res.write('</table>');
    res.write('</body>');
    res.end();
}); 

//post-response auf die Ressource /planeten
app2.post('/planeten', function(req, res) {
    //Daten aus der Response wird in der Konsole angezeigt
    console.log(req.body);
    //Daten werden zum Array hinzugefügt
    planeten.push(req.body);
    res.end();
});

//Webserver wird auf Port 3000 erstellt mit Ausgabe in der Konsole. Yay.
app2.listen(3000, function(){
	console.log('Express server is running...');
});
    