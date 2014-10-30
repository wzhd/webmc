library webmc.server;

import 'dart:io';
import 'package:crypto/crypto.dart' show MD5;
import 'dart:convert' show UTF8, JSON;
import 'package:route/server.dart';
import 'package:route/url_pattern.dart';
import 'package:http_server/http_server.dart' show VirtualDirectory;

final listUrl = new UrlPattern(r'/list');
final playUrl = new UrlPattern(r'/play');
final thumbUrl = new UrlPattern(r'/thumb');
String mediaDir = '/home/wzhd/Videos/';
String thumbDir = '/home/wzhd/.thumbnails/normal/';

class Server {
  serveList(HttpRequest req) {

    var programmes = new Directory(mediaDir).listSync();
    programmes = programmes.map((FileSystemEntity entity) {
      String path = entity.path;
      return {
        'name': path,
        'play': '/play?filename='+path,
        'thumb': '/thumb?filename='+path
      };
    });
    programmes = programmes.toList();
    req.response.write(JSON.encode(programmes));
    req.response.close();
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
    md5.add(UTF8.encode( new Uri.file(path).toString()));
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

  Server() {
    final MY_HTTP_ROOT_PATH = 'web';
    final virDir = new VirtualDirectory(MY_HTTP_ROOT_PATH)
      ..allowDirectoryListing = true
      ..followLinks = true
      ..jailRoot = false;

    HttpServer.bind(InternetAddress.ANY_IP_V4, 8000).then((server) {
      var router = new Router(server)
        ..serve(listUrl, method: 'GET').listen(serveList)
        ..serve(playUrl, method: 'GET').listen(servePlayer)
        ..serve(thumbUrl, method: 'GET').listen(serveThumb)
        ..defaultStream.listen(virDir.serveRequest);
    });

  }

}
