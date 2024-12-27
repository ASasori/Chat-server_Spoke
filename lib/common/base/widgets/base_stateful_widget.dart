import 'package:flutter/material.dart';
import 'package:get/get.dart';

abstract class BaseState<C extends GetxController, T extends StatefulWidget> extends State<T> {
  String? tag;

  C get controller => Get.find<C>(tag: tag);

  Widget onBuilder(BuildContext context) => const SizedBox();

  @override
  Widget build(BuildContext context) {
    return onBuilder(context);
  }
}
