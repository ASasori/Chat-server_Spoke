import 'package:flutter/material.dart';
import 'package:tekup_connection_mobile/common/base/widgets/base_page_widget.dart';
import 'package:tekup_connection_mobile/ui/home/controller/home_controller.dart';

class HomePage extends BasePage<HomeController> {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
          color: Colors.pink,
        ));
  }
}
