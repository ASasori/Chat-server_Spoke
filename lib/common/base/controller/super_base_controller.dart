import 'package:get/get.dart';

import '../widgets/base_widgets.dart';

class SuperBaseController<T> extends SuperController<T> with BaseCustomWidgets {

  @override
  void onDetached() {}

  @override
  void onInactive() {}

  @override
  void onPaused() {}

  @override
  void onResumed() {}

  @override
  void onHidden() {}
}
