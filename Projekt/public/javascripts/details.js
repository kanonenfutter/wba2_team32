    var topic = window.location.pathname;

    // PubSub client erstellen
    var client = new Faye.Client('/faye');
    // Topic '/fahrten' subscriben
    var subscription = client.subscribe(topic, function(message) {
        addTableRow(message);
    });
$(document).ready(function() {
    alert(topic);
    //Bei Seitenaufruf: Cookie "username" wird ausgelesen
    document.getElementById('active_user').innerHTML = getCookie("username");


});

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "invalid_user";
};

function addTableRow(message) {
    $('#tabelle').append('<tr><td>' + message.name + '<td></td></tr>');
    };