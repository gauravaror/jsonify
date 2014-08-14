var jsdom = require("jsdom");
var tableJsonConverter = require("./tableJsonConverter.js");

jsdom.env({
  url: process.argv[2],
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (errors, window) {
    tableJsonConverter.jsonifyTable(errors,window);
  }
});
