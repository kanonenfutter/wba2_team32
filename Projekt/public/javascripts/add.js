$(document).ready(function() {
    //Bei Seitenaufruf: Cookie "username" wird ausgelesen
    document.getElementById('active_user').innerHTML = getCookie("username");
    checkUser(getCookie("username"));


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

function checkUser(username){
    if (username.localeCompare("invalid_user")==0) {
        alert('Ups. Log dich doch erst bitte ein.')
        window.location.href = "/login.html";
    }
}