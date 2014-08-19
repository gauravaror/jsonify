var stat = false;
var json = undefined;
chrome.runtime.sendMessage({jsonify: "currentpage",url: window.href}, function(response) {
     console.log(response);
     checkStatus();
});

function checkStatus(){
        chrome.runtime.sendMessage({getjson: "now",url: window.href},function(response) {
            console.log(response);
            if(response.status == "OK") { 
                json = response.json;
                document.getElementById("jsoncontent").textContent = JSON.stringify(json,undefined,4);
                console.log(json);
                stat=true;
            } else if (response.status == "WAIT"){
                checkStatus();
            }
        });
}
