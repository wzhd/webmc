var querystring = require("querystring");
var fs = require("fs");
var omxcontrol = require("omxcontrol");
var config = require("./config.json");

function start(response) {
  console.log("Request handler 'start' was called.");
  fs.readdir(config.movDir,function(err, files){
    if(err){
      response.writeHead(500,{ "Content-Type":"text/plain"});
      response.write(err + "\n");
      response.end();
    }
    else{
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write('<html><head></head><body>');
      for (file in files){
        if(files[file] != 'lost+found'){
          response.write('<a href="http://' + config.hostAddr + '/play?filename=' + files[file] + '">' + files[file] + '</a>' + '<br>');
          }
      }
      response.write('</body><html');
      response.end();
    }
  });
}

function play(response, request, query) {
  console.log("Request handler 'play' was called.");
  for (item in query){
    console.log("Query: " + item + ": " +  query[item]);
    omxcontrol.start(config.movDir + "/" + query[item]);
    console.log("playing " + query[item]);
    }
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("playing");
  response.end();
}

exports.start = start;
exports.play = play;
