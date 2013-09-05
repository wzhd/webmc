var fs = require("fs");
var config = require("../config.json");

function start(request, response) {
  fs.readdir(config.movDir,function(err, files){
    if(err){
      response.status(500);
      response.render('index', { body: err });
    }
    else{
      var htmlBody = '';
      for (file in files){
        if(files[file] != 'lost+found'){
          htmlBody += ('<img src="http://' + config.hostAddr + '/thumbnail?filename=' + files[file] +  '"><br>');
          htmlBody += ('<a href="http://' + config.hostAddr + '/play?filename=' + files[file] + '">' + files[file] + '</a>' + '<br>');
          }
      }
      response.render('index', { body: htmlBody });
    }
  });
}

exports.start = start;
