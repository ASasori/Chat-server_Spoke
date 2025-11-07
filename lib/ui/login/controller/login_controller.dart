import 'package:get/get.dart';
import 'package:tekup_connection_mobile/common/base/controller/base_controller.dart';
import 'package:tekup_connection_mobile/common/repository/auth_repository.dart';

class LoginController extends BaseController {
  static LoginController get to => Get.find<LoginController>();

  AuthRepository repository = Get.find();
  Rx<bool> isShowPassword = false.obs;


  void toggleShowPassword (){
    isShowPassword.value = !isShowPassword.value;
  }
}
