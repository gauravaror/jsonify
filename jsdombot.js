var jsdom = require("jsdom");
var tableJsonConverter = require("./tableJsonConverter.js");

jsdom.env({
  url: "http://en.wikipedia.org/wiki/List_of_Delhi_metro_stations",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (errors, window) {
    tableJsonConverter.jsonifyTable(errors,window);
  }
});
