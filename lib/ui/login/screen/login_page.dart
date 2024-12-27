import 'package:flutter/material.dart';
import 'package:tekup_connection_mobile/common/base/widgets/base_page_widget.dart';
import 'package:tekup_connection_mobile/ui/login/controller/login_controller.dart';

class LoginPage extends BasePage<LoginController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      color: Colors.pink,
    ));
  }
}
