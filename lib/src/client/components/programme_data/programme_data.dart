library webmc.programme_list;

import 'package:polymer/polymer.dart';

@CustomTag('programme-data')
class ProgrammeData extends PolymerElement {
  @published var data;

  ProgrammeData.created() : super.created();

  void handleResponse(res) {
    data = $['ajax'].response;
  }
}
