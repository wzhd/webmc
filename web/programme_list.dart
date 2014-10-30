library webmc.programme_list;

import 'package:polymer/polymer.dart';



@CustomTag('programme-list')
class ProgrammeList extends PolymerElement {
  @observable List<int> programmes;
  ProgrammeList.created() : super.created();
}
