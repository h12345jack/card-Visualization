//src
var serverIp = 'http://127.0.0.1:3000/';

//react
if($("div#root").length == 0){
    iScript = document.createElement("script");
    iScript.type = "text/javascript";
    iScript.src = serverIp + '/static/js/bundle.js';
    document.getElementsByTagName("head")[0].appendChild(iScript); 
    var btn = document.createElement("div");
    btn.setAttribute("id","root");
    btn.setAttribute("style","position: relative;top: -45px;left: 380px;")
    var carmangeContent = document.getElementById("carmangeContent");
    carmangeContent.appendChild(btn);
}else{
    console.log("VIS button exists!");
}

// var strVar="";
// strVar += "<img src=\"http://127.0.0.1:3000/img/loading.gif\" width=\"26\">";
// var loading = document.createElement("div");
// loading.setAttribute("id","my-loading");
// loading.setAttribute("style","position: absolute;top: -45px;left: 380px;")
// loading.innerHTML = strVar;
// $("#carmangeContent")[0].appendChild(loading);