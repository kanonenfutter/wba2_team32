            // PubSub client erstellen
            var client = new Faye.Client('/faye');
            // Topic '/fahrten' subscriben
            var subscription = client.subscribe('/fahrten', function(message) {
                addTableRow(message);
            });
    
            // get auf Ressource '/fahrten'
            var ajaxGet = $.ajax({
                url: '/fahrten',
                type: 'GET',
                contentType: 'application/json'
            });
            // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
            ajaxGet.done(function(data) {
                data.forEach(function(fahrt) {
                addTableRow(fahrt);
                });
            });
            // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
            ajaxGet.fail(function(e) {
                alert('Fehler:' + JSON.stringify(e) + ')');
            });
            // Zeile/Dokument zur Tabelle hinzufuegen 
            var addTableRow = function(fahrt) {
                $('#tabelle').append('<tr><td>' + fahrt.name + '</td><td>' + fahrt.start + '</td><td>' + fahrt.destination + '</td><td>' + fahrt.date + '</td><td>' + fahrt.time + '</td><td>' + fahrt.seats + '</td><td>'+ '<a href="/fahrten/'+ fahrt._id + '">mehr</a></td></tr>');
            };