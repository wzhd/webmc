var fs = require('fs');
var url = require("url");
var querystring = require("querystring");
var config = require('../config.json');
var execSync = require('exec-sync');

function thumbnail(req, res){
  var qrystr = url.parse(req.url).query;
  var FileName = querystring.parse(qrystr).filename;
  var movFileName = config.movDir + '/' + FileName;
  var thumbFileName = config.movDir + '/'  + '.' + FileName + '.jpg';
  fs.exists(thumbFileName, function(exists){

    if(!exists){
      console.log('Generating thumbnail for file: ' + movFileName);
      execSync('ffmpeg -i '+ movFileName +
                       ' -t 2 -r 0.5 ' + thumbFileName, function(err, stdout, stderr){
                         if(err)
                           console.log('Error generating thumbnail' + err + '\n');
                       });
    }

    fs.readFile(thumbFileName, function(err, data){

      if(err){
        res.send("No thumbnail available");
      }

      else{
        res.writeHead(200, {"Content-Type": "image/png"});
        res.write(data, "binary");
        res.end();
      }
    });
  });
}

exports.thumbnail = thumbnail;
