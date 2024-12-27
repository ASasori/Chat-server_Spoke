import 'package:get/get.dart';
import 'package:tekup_connection_mobile/ui/splash/controller/splash_controller.dart';

class SplashBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<SplashController>(SplashController());
  }
}
