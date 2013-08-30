var http = require("http");
var url = require("url");
var querystring = require("querystring");
var config = require("./config.json");

function start(route,handle){
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var qrystr = url.parse(request.url).query;
    var query = querystring.parse(qrystr);
    console.log("Request for " + pathname +" received.");
    route(handle, pathname, response, request, query);
  }
  http.createServer(onRequest).listen(config.listenPort);
  console.log("Server has started.");
}
exports.start = start;
