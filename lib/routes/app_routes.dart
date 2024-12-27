import 'package:get/get.dart';
import 'package:tekup_connection_mobile/ui/login/binding/login_binding.dart';
import 'package:tekup_connection_mobile/ui/login/screen/login_page.dart';
import 'package:tekup_connection_mobile/ui/main/binding/main_binding.dart';
import 'package:tekup_connection_mobile/ui/main/screen/main_page.dart';
import 'package:tekup_connection_mobile/ui/splash/binding/splash_binding.dart';

import '../ui/splash/screen/splash_page.dart';
abstract class PageName {
  static const splashPage = '/';
  static const mainPage = '/main';
  static const loginPage = '/login';
}

abstract class Argument {}

class AppPages {
  static final routes = [
    GetPage(
      name: PageName.splashPage,
      page: () =>  const SplashPage(),
      binding: SplashBinding(),
    ),
    GetPage(
      name: PageName.mainPage,
      page: () => const MainPage(),
      binding: MainBinding(),
    ),
    GetPage(
      name: PageName.loginPage,
      page: () => const LoginPage(),
      binding: LoginBinding(),
    ),
  ];
}
