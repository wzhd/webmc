var querystring = require("querystring");
var omxcontrol = require("omxcontrol");
var config = require("../config.json");
var url = require("url");

function play(request, response) {
  var pathname = url.parse(request.url).pathname;
  var qrystr = url.parse(request.url).query;
  var query = querystring.parse(qrystr);
  var status = 'Playing:';
  for (item in query){
    omxcontrol.start(config.movDir + "/" + query[item]);
    status += (config.movDir + "/" + query[item]);
  }
  response.render('index', { body: status });
}

exports.play = play;
