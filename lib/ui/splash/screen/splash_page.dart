import 'package:flutter/material.dart';
import 'package:tekup_connection_mobile/common/base/widgets/base_page_widget.dart';
import 'package:tekup_connection_mobile/ui/splash/controller/splash_controller.dart';

class SplashPage extends BasePage<SplashController> {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      color: Colors.white,
    ));
  }
}
