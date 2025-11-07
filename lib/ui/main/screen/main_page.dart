import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:tekup_connection_mobile/common/base/widgets/custom_navigation_bar.dart';
import 'package:tekup_connection_mobile/ui/main/controller/main_controller.dart';

import '../../../common/base/widgets/base_page_widget.dart';

class MainPage extends BasePage<MainController> {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container (
      decoration: const BoxDecoration(
        color: Colors.greenAccent,
      ),
    );
  }
}
