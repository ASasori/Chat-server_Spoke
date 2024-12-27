import 'package:get/get.dart';
import 'package:tekup_connection_mobile/ui/main/controller/main_controller.dart';

class MainBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<MainController>(MainController());
  }
}
