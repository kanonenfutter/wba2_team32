//Notes: added mongoDB, Pubsub, Errorhandling, edited .post and .get, human readable variables :P, 
var http = require('http');
var express = require('express');
var mongoDB = require('mongoskin');
var faye = require('faye');

var app3 = express();
var server = http.createServer(app3);

// Verbindung zur mongoDB

var db =mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true',{safe: true});

// Collection "fahrten" binden

db.bind('fahrten');

var fahrtenCollection = db.fahrten;

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


//get-response auf die Ressource /fahrten
app3.get('/fahrten', function (req, res, next) {
    fahrtenCollection.findItems(function(error, result){
        if (error)
            next(error);
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});

//get-response auf die Ressource /fahrten
app3.get('/fahrten/*', function (req, res, next) {
    console.log(JSON.stringify(req.url));
    console.log(JSON.stringify(req.params[0]));
    var objID = req.params[0];
//    fahrtenCollection.find({_id : ObjectId("405")}, function(error, result){
//        if (error)
//            next(error);
//        else{
//            res.writeHead(200, {'Content-Type': 'application/json'});
//            res.end(JSON.stringify(result));
//        };
//    });
    //console.log(fahrtenCollection.find({"_id" : ObjectId("534e623eb182540000b48831")}));
    fahrtenCollection.find({_id: db.ObjectID.createFromHexString('534e623eb182540000b48831')}).toArray(function(err, result) {
        console.log('Band members of Road Crew');
        console.log(result);
    });
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();
});
    

//post-response auf die Ressource /fahrten
app3.post('/fahrten', function(req, res, next) {
    fahrtenCollection.insert(req.body, function(error, fahrtenCollection){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log(JSON.stringify(req.body) + ' wurde zur Datenbank hinzugefuegt!');
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
    