import 'package:get/get.dart';
import 'package:tekup_connection_mobile/ui/home/controller/home_controller.dart';

class MainBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<HomeController>(HomeController());
  }
}
