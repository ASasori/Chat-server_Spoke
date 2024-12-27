import 'package:get/get.dart';

import '../../../common/repository/auth_repository.dart';
import '../../../common/repository/auth_repository_impl.dart';
import '../controller/login_controller.dart';

class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<AuthRepository>(AuthRepositoryImpl());
    Get.put<LoginController>(LoginController());
  }
}
