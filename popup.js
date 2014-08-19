var stat = false;
var json = undefined;
chrome.runtime.sendMessage({jsonify: "currentpage",url: window.href}, function(response) {
     console.log(response);
     checkStatus();
});

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function populateJson(element,jsonString) {
    var tmp = jsonString.replace(/\\n/g,"<br>");
    console.log(tmp);
    var tmp2 = tmp.replace(/\\\"/g,"\"",tmp);
    console.log(tmp2);
    element.innerHTML  = tmp2;
}
function checkStatus(){
        chrome.runtime.sendMessage({getjson: "now",url: window.href},function(response) {
            console.log(response);
            if(response.status == "OK") { 
                json = response.json;
                populateJson(document.getElementById("jsoncontent"),JSON.stringify(json,undefined,4));
                console.log(json);
                stat=true;
            } else if (response.status == "WAIT"){
                checkStatus();
            }
        });
}
