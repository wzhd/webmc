var requestHandlers = require("./routes/requestHandlers");
var express = require("express");
var config = require("./config.json");
var path = require("path");

app = express();

app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',requestHandlers.start);
app.get('/play',requestHandlers.play);
app.listen(config.listenPort);
console.log("Server has started.");
