library webmc;

import 'dart:io';
import 'package:crypto/crypto.dart' show MD5;
import 'dart:convert' show UTF8;
import 'package:route/server.dart';
import 'package:route/url_pattern.dart';

final indexUrl = new UrlPattern(r'/');
final playUrl = new UrlPattern(r'/play');
final thumbUrl = new UrlPattern(r'/thumb');
String mediaDir = '/home/wzhd/Videos/';
String thumbDir = '/home/wzhd/.thumbnails/normal/';
String hostAddr = '127.0.0.1:8000';

serveIndex(HttpRequest req) {
  hostAddr = req.headers.host + ':' + req.headers.port.toString();

  req.response.headers.contentType = ContentType.HTML;
  req.response.write('''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Start - Webmc</title>
  </head>
  <body>
    <header>
    Webmc - webpage based media center
    </header>
    <hr>
''');
  new Directory(mediaDir).list().listen((FileSystemEntity entity) {
    try {
      print(entity.path);
      req.response.write(
          '''<img src="http://$hostAddr/thumb?filename=${entity.path}"/><br>
              <a href="http://$hostAddr/play?filename=${entity.path}">
              ${entity.path}
              </a><br>''');
    } catch (exception, stackTrace) {
      print(exception);
      print(stackTrace);
    }
  }).onDone(() {
    req.response.write('</body></html>');
    req.response.close();
  });
}

servePlayer(HttpRequest req) {
  Map query = req.uri.queryParameters;
  if (!query.containsKey('filename')) {
    req.response.write('media not found');
  } else {
    String fileName = query['filename'];
    Process.start('smplayer', [fileName]);
    req.response.write('playing $fileName');
  }
  req.response.close();
}

serveThumb(HttpRequest req) {
  Map query = req.uri.queryParameters;
  if (!query.containsKey('filename')) {
    req.response.close();
    return;
  }
  String path = query['filename'];
  MD5 md5 = new MD5();
  md5.add(UTF8.encode('file://' + path));
  var thumbFileName = thumbDir + md5.close().expand((el) {
    return [el ~/ 16, el % 16];
  }).map((el) {
    List hexDigits = ['a', 'b', 'c', 'd', 'e', 'f'];
    return el < 10 ? el.toString() : hexDigits[el - 10].toString();
  }).join() + '.png';
  File thumbFile = new File(thumbFileName);
  if (thumbFile.existsSync()) {
    thumbFile.openRead().listen((List<int> data) {
      req.response.headers.contentType = ContentType.parse('image/png');
      req.response.add(data);
      req.response.close();
    });
  }
  else {
    req.response.close();
  }
}

void main() {
  HttpServer.bind(InternetAddress.ANY_IP_V4, 8000).then((server) {
    print('Listening at 8000');
    var router = new Router(server)
        ..serve(indexUrl, method: 'GET').listen(serveIndex)
        ..serve(playUrl, method: 'GET').listen(servePlayer)
        ..serve(thumbUrl, method: 'GET').listen(serveThumb);
  });

}
