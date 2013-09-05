var routes = require("./routes");
var user = require("./routes/user");
var content = require("./routes/content.js");
var express = require("express");
var config = require("./config.json");
var path = require("path");

app = express();

app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',routes.start);
app.get('/play',user.play);
app.get('/thumbnail',content.thumbnail);
app.listen(config.listenPort);
console.log("Server has started.");
