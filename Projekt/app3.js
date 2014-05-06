var http = require('http');
var path = require('path');
var express = require('express');
var mongoDB = require('mongoskin');
var faye = require('faye');
var jade = require('jade');
var BSON = require('mongodb').BSONPure;
// warscheinlich nicht benötigt
var cookieParser = require('cookie-parser');
var app3 = express();
var server = http.createServer(app3);

// Verbindung zur mongoDB

var db =mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true',{safe: true});

// Collection "fahrten" binden

db.bind('fahrten');

var fahrtenCollection = db.fahrten;

// Collection "mitfahrer" binden

db.bind('mitfahrer');

var mitfahrerCollection = db.mitfahrer;

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

app3.set('views', path.join(__dirname, 'views'));
app3.set('view engine', 'jade');

//benötigt um Informationen des Requests zu parsen
app3.use(express.json());
app3.use(express.urlencoded());

//http logger
app3.use(express.logger('dev'));

//Middleware, benötigt für cookies
//app3.use(express.cookieParser());

//Errorhandling
app3.use(function(error, req, res, next) {
    console.error(error.stack);
    res.end(error.message);
    
});


//get-response auf die Ressource /fahrten. Ausgabe aller Fahrten.
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

//get auf die Ressource /search. Eingabe: Suchanfrage. Ausgabe: Suchergebnisse
app3.get('/search', function (req, res, next) {
    console.log(JSON.stringify(req.query));
    fahrtenCollection.find(req.query).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        };
    });
});

//get auf die Ressource /fahrten/:id. Detailansicht einer Fahrt
app3.get('/fahrten/:id', function (req, res, next) {
    console.log("GET: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    fahrtenCollection.find({_id: obj_id}).toArray(function(error, result) {
        if (error)
            next(error);
        else {
            
            console.log('Result:');
            console.log(result);
            console.log(result[0]);
//            res.writeHead(200, {'Content-Type': 'application/json'});
//            res.end(JSON.stringify(result));
            res.render('details', result[0]);
            res.end();
        }
    });
});

//get auf die Ressource /fahrten/:id/anfragen.
app3.get('/fahrten/:id/anfragen', function (req, res, next) {
    console.log("GET: " + JSON.stringify(req.url));
    console.log("param: fahrt_id:" + req.params.id);
    mitfahrerCollection.find({fahrt_id: req.params.id}).toArray(function(error, result) {
        console.log("suche auf mitfahrer");
        if (error)
            next(error);
        else {
            console.log('Result:');
            console.log(result);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        }
    });
});

//delete auf die Ressource /fahrten/:id
app3.delete('/fahrten/:id', function(req, res) {
    console.log("DEL: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    fahrtenCollection.remove({_id: obj_id}, function(error, fahrtenCollection){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log(obj_id + ' wurde aus der Datenbank gelöscht!');
        }
    });
});

//post-response auf die Ressource /fahrten
app3.post('/fahrten', function(req, res, next) {
    fahrtenCollection.insert(req.body, function(error, fahrtenCollection){
        if (error) next(error);
        else {
            //res.write('Daten wurden gespeichert');
            console.log('Die Fahrt:' + JSON.stringify(req.body) + ' wurde zur Datenbank hinzugefuegt!');
            console.log(req.body._id);
        }
    });
    // Dokument an Topic '/fahrten' publishen
	var publication = pubSubClient.publish('/fahrten', req.body);
	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body._id + ' published to "/fahrten"!');
		res.end();
	// Promise handler wenn Publish fehlgeschlagen
	}, function(error) {
		next(error);
	});
});

//post-response auf die Ressource /fahrten/:id/anfragen
app3.post('/fahrten/:id/anfragen', function(req, res, next) {
    console.log("POST: " + JSON.stringify(req.url));
    console.log("param: _ID:" + req.params.id);
    console.log(req.body);
    console.log(req.body.name);
    mitfahrerCollection.insert(req.body, function(error, mitfahrerCollection){
        if (error) next(error);
        else {
            console.log('Anfrage:' + JSON.stringify(req.body) + ' wurde zur Datenbank hinzugefuegt!');
            console.log(req.body._id);
        }
    });
    var obj_id = BSON.ObjectID.createFromHexString(req.params.id);
    fahrtenCollection.update({_id: obj_id}, {'$inc':{seats:-1}}, function(err) {
        if (err) throw err;
        console.log('Updated!');
    });

    
    // Dokument an Topic '/fahrten/:id/anfragen' publishen
	var publication = pubSubClient.publish(req.url, req.body);
	// Promise handler wenn Publish erfolgreich
	publication.then(function() {
		// Response HTTP status code 200 an Client
		res.writeHead(200, 'OK');
		// Name vom Objekt in der Konsole ausgeben
		console.log(req.body._id + ' published to "/fahrten/' + req.params.id+ '"!');
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
    