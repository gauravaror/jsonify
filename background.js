var jsoncallback = {};
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
  // No tabs or host permissions needed!
if (request.jsonify == "currentpage") {
      console.log('Browser action taken, jsonizing the page');
      chrome.tabs.executeScript({
            file: 'jquery.js',
            runAt: 'document_end'
      });
      chrome.tabs.executeScript({
        file: 'tableJsonConverter.js',
        runAt: 'document_end'
      });
      jsoncallback[request.url] = undefined;
      sendResponse("RECEIVEDJSONIZINGEQUEST");
    } else if (request.jsonresult == "OK") {
        console.log("zfds");
        jsoncallback[request.url] = request.result;
        sendResponse("done");
    } else if(request.getjson == "now") {
        if(jsoncallback[request.url]) {
            sendResponse({'status':'OK','json': jsoncallback[request.url]});
        }  else {
            sendResponse({'status':'WAIT'});
        }
    }
});
