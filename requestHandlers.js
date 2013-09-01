var querystring = require("querystring");
var fs = require("fs");
var omxcontrol = require("omxcontrol");
var config = require("./config.json");
var url = require("url");

function start(request, response) {
  fs.readdir(config.movDir,function(err, files){
    if(err){
      response.status(500);
      response.render('index', { body: err });
    }
    else{
      var movList = '';
      for (file in files){
        if(files[file] != 'lost+found'){
          movList += ('<a href="http://' + config.hostAddr + '/play?filename=' + files[file] + '">' + files[file] + '</a>' + '<br>');
          }
      }
      response.render('index', { body: movList });
    }
  });
}

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

exports.start = start;
exports.play = play;
