var json = undefined;
var spinner = undefined;
var editorMode = false;
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
//    console.log(tmp);
    var tmp2 = tmp.replace(/\\\"/g,"\"");
    var tmp3 = tmp2.replace(/\\\\/g,"");
  //  console.log(tmp2);
    element.innerHTML  = tmp3;
}
function getEditedJson() {
    var jsondiv = document.getElementById("jsoncontent");
    var divs = jsondiv.childNodes;
    var jsonob = {};
    for(var i=0;i<divs.length-1;i++) {
        if(divs[i].childNodes[0].checked) {
            jsonob[divs[i].childNodes[1].textContent] = JSON.parse(divs[i].childNodes[2].textContent);
        }
    }
    json = JSON.stringify(jsonob,null,4);
    changeMode();
}
function jsonEditor(element,jsonObj) {
    element.innerHTML= "";
    for (var key in jsonObj) {
        var innerdiv = document.createElement("DIV");
        var x = document.createElement("INPUT");
        x.setAttribute("type", "checkbox");
        innerdiv.appendChild(x);
        var textnode = document.createTextNode(key);
        innerdiv.appendChild(textnode);
        var parahid = document.createElement("div")
        parahid.textContent = JSON.stringify(JSON.stringify(jsonObj[key],undefined,4),undefined,4);
        parahid.style.display = "none";
        var para = document.createElement("div")
        para.innerHTML = JSON.stringify(JSON.stringify(jsonObj[key],undefined,4),undefined,4).replace(/\\n/g,"<br>").replace(/\\\"/g,"\"");
        innerdiv.appendChild(parahid);
        innerdiv.appendChild(para);
        var button = document.createElement("BUTTON");
        button.textContent = "Show Json";
        button.onclick = function(par,butt) {
                return function() {
                    if(butt.textContent == "Show Json") {
                        par.style.display = "block";
                        butt.textContent = "Hide Json";
                    } else {
                        par.style.display = "none";
                        butt.textContent = "Show Json";
                        
                    }
                }
        }(para,button)
        innerdiv.appendChild(button);
        element.appendChild(innerdiv);
        console.log(key, jsonObj[key]);
        para.style.display = "none";
    }
    var button = document.createElement("BUTTON");
    var buttontextnode = document.createTextNode("Done!");
    button.appendChild(buttontextnode);
    button.onclick = getEditedJson
    element.appendChild(button);
}

function displayJSON(givenjson)  {
    if(editorMode) {
        jsonEditor(document.getElementById("jsoncontent"),JSON.parse(json));
    } else {
        //populateJson(document.getElementById("jsoncontent"),JSON.stringify(givenjson.replace(/,/g,"\\n").replace(/\\\"/g,"\""),undefined,4));
        populateJson(document.getElementById("jsoncontent"),JSON.stringify(givenjson,undefined,4));
    }
}

function checkStatus(){
        chrome.runtime.sendMessage({getjson: "now",url: window.href},function(response) {
 //           console.log(response);
            if(response.status == "OK") { 
                json = response.json;
                spinner.stop();
                //console.log(json);
                displayJSON(json);
            } else if (response.status == "WAIT"){
                checkStatus();
            }
        });
}

//Spinner code
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
function changeMode(){
    editorMode = !editorMode;
    var editor = document.getElementById('editorviewer');
    if(editorMode) {
        editor.textContent = "Viewer";
    }
    else {
        editor.textContent = "Editor";
    }
    displayJSON(json);
}
document.addEventListener("DOMContentLoaded", function(event) {
    var target = document.getElementById('spinner');
    spinner = new Spinner(opts).spin(target);
    var editor = document.getElementById('editorviewer');
    editor.addEventListener('click',changeMode);
    if(editorMode) {
        editor.textContent = "Viewer";
    }
    else {
        editor.textContent = "Editor";
    }
    
//    target.appendChild(spinner.el);
});
