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
      var htmlBody = '';
      for (file in files){
        if(config.movFileType.indexOf(path.extname(files[file])) > -1 ){
          htmlBody += ('<img src="http://' + config.hostAddr + '/thumbnail?filename=' + files[file] +  '"><br>');
          htmlBody += ('<a href="http://' + config.hostAddr + '/play?filename=' + files[file] + '">' + files[file] + '</a>' + '<br>');
        }
      }
      response.render('index', { body: htmlBody });
    }
  });
}

exports.start = start;
