var stat = false;
var json = undefined;
var spinner = undefined;
chrome.runtime.sendMessage({jsonify: "currentpage",url: window.href}, function(response) {
     console.log(response);
     checkStatus();
});

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function populateJson(element,jsonString) {
    if(spinner) {
        spinner.stop();
    }
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




var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};
document.addEventListener("DOMContentLoaded", function(event) {
    var target = document.getElementById('spinner');
    spinner = new Spinner(opts).spin(target);
//    target.appendChild(spinner.el);
});
