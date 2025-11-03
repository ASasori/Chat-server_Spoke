import 'package:get/get.dart';
import 'package:tekup_connection_mobile/common/base/controller/base_controller.dart';
import 'package:tekup_connection_mobile/ui/home/screen/home_page.dart';

class MainController extends BaseController {
  static MainController get to => Get.find<MainController>();

  final pages = [
    HomePage(),
    HomePage(),
    HomePage(),
    HomePage(),
    HomePage(),
  ];

  var currentIndex = 0.obs;

  List<bool> get isSelectedList => List.generate(4, (index) => currentIndex.value == index);

  void updateIndex (int index){
    currentIndex.value = index;
  }
}
