var fs = require("fs");
var config = require("../config.json");
var path = require('path');

function start(request, response) {
  fs.readdir(config.movDir,function(err, files){
    if(err){
      response.status(500);
      response.render('index', { body: err });
    }
    else{
      var movList = '';
      for (file in files){
        if(config.movFileType.indexOf(path.extname(files[file])) > -1 )
          movList += ('<a href="http://' + config.hostAddr + '/play?filename=' + files[file] + '">' + files[file] + '</a>' + '<br>');
          }
      }
      response.render('index', { body: movList });
    });
}

exports.start = start;
