//Notes: added mongoDB, Pubsub, Errorhandling, edited .post and .get, human readable variables :P, 
var http = require('http');
var express = require('express');
var mongoDB = require('mongoskin');
var faye = require('faye');

var app3 = express();
var server = http.createServer(app3);

// Verbindung zur mongoDB

var db =mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true',{safe: true});

// Collection "planeten" binden

db.bind('planeten');

var planetenCollection = db.planeten;

// Faye
// NoteAdapter konfigurieren
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});

// Nodeadapter zum http-Server hinzufuegen
bayeux.attach(server);
//PubSub-Client erzeugen
var pubSubClient = bayeux.getClient();

//Verzeichnisdefinierung fuer den Zugriff von Aussen
app3.use(express.static(__dirname+'/public'));

//benötigt um Informationen des Requests zu parsen
app3.use(express.json());
app3.use(express.urlencoded());

//Errorhandling
app3.use(function(error, req, res, next) {
    console.error(error.stack);
    res.end(error.message);
    
});


//get-response auf die Ressource /planeten
app3.get('/planeten', function (req, res, next) {
    planetenCollection.findItems(function(error, result){
        if (error)
            next(error);
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});
    

//post-response auf die Ressource /planeten
app3.post('/planeten', function(req, res, next) {
    planetenCollection.insert(req.body, function(error, planetenCollection){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log(req.body.name + ' wurde zur Datenbank hinzugefuegt!');
        }
    });
    // Dokument an Topic '/planeten' publishen
	var publication = pubSubClient.publish('/planeten', req.body);

	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body.name + ' published to "/planeten"!');
		res.end();
	// Promise handler wenn Publish fehlgeschlagen
	}, function(error) {
		next(error);
	});
});

//Webserver wird auf Port 3000 erstellt.
server.listen(3000, function(){
	console.log('Express server is running...');
});
    