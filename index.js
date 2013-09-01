var requestHandlers = require("./requestHandlers");
var express = require("express");
var config = require("./config.json");

app = express();

app.use(express.logger('dev'));

app.get('/',requestHandlers.start);
app.get('/play',requestHandlers.play);
app.listen(config.listenPort);
console.log("Server has started.");
