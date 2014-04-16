//Notes: added mongoDB, Pubsub, Errorhandling, edited .post and .get, human readable variables :P, 
var http = require('http');
var express = require('express');
var mongoDB = require('mongoskin');
var faye = require('faye');

var app = express();
var server = http.createServer(app);

// Verbindung zur mongoDB

var db =mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true',{safe: true});

// Collection "planeten" binden

db.bind('fahrten');

var fahrten = db.fahrten;

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
app.use(express.static(__dirname+'/public'));

//benötigt um Informationen des Requests zu parsen
app.use(express.json());
app.use(express.urlencoded());

//Errorhandling
app.use(function(error, req, res, next) {
    console.error(error.stack);
    res.end(error.message);
    
});


//get-response auf die Ressource /fahrten
app.get('/fahrten', function (req, res, next) {
    fahrten.findItems(function(error, result){
        if (error)
            next(error);
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});
    

//post-response auf die Ressource /fahrten
app.post('/fahrten', function(req, res, next) {
    fahrten.insert(req.body, function(error, fahrten){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log(req.body.name + ' wurde zur Datenbank hinzugefuegt!');
        }
    });
    // Dokument an Topic '/fahrten' publishen
	var publication = pubSubClient.publish('/fahrten', req.body);

	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body.name + ' published to "/fahrten"!');
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
    