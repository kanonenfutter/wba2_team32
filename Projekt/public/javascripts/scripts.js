
    // PubSub client erstellen
    var client = new Faye.Client('/faye');
    // Topic '/fahrten' subscriben
    var subscription = client.subscribe('/fahrten', function(message) {
        addTableRow(message);
    });

$(document).ready(function() {
    var user = "invalid_username";
    document.getElementById('active_user').innerHTML=user; 
    populateTable();
    // Delete User link click
    $('#tabelle').on('click', 'td a.linkdeletefahrt',  deleteFahrt);
    // Login User link click
    $('#loginform').on('click', 'a.linkloginuser',  loginUser);

});

// Tabelle aufbauen
function populateTable() {
    // get auf Ressource '/fahrten'
    $.ajax({
        url: '/fahrten',
        type: 'GET',
        contentType: 'application/json'
    // Tabellenerweiterung mit Aufruf von addTableRow wenn Promise erfolgreich
    }).done(function(data) {
        data.forEach(function(fahrt) {
        addTableRow(fahrt);
        });
    // Popup mit Fehlermeldung wenn Promise fehlgeschlagen
    }).fail(function(e) {
        alert('Fehler:' + JSON.stringify(e) + ')');
    });
    
};

// Zeile/Dokument zur Tabelle hinzufuegen 
function addTableRow(fahrt) {
    $('#tabelle').append('<tr><td>' + fahrt.name + '</td><td>' + fahrt.start + '</td><td>' + fahrt.destination + '</td><td>' + fahrt.date + '</td><td>' + fahrt.time + '</td><td>' + fahrt.seats + '</td><td>'+ '<a href="#" class="linkdeletefahrt" rel="'+ fahrt._id +'">delete</a></td></tr>');
    };

// Fahrt entfernen
function deleteFahrt(event) {

    event.preventDefault();

    // Popup confirmation dialog
    var confirmation = confirm('Sind Sie sicher, dass Sie den Eintrag löschen möchten?');

    // Check, if the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/fahrten/' + $(this).attr('rel')
        });
    }
    // Else: do nothing
    else {
        return false;
    }

};

function loginUser(username){
    event.preventDefault();
    
    user= document.getElementById('input_username').value;
    document.getElementById('active_user').innerHTML=user; 
}
    