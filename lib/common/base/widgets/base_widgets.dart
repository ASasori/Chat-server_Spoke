import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

mixin class BaseCustomWidgets implements CustomWidgets {
  @override
  void showSnackBar({String title = "", String message = ""}) {
    Get.snackbar(
      title,
      message,
      backgroundColor: Colors.black45,
      barBlur: 8.0,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.only(bottom: 10.0, left: 10.0, right: 10.0),
      duration: const Duration(seconds: 2),
    );
  }

  @override
  void showErrorSnackBar({String title = "", String message = ""}) {
    Get.snackbar(
      title,
      message,
      backgroundColor: Colors.red,
      barBlur: 10.0,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.only(bottom: 10.0, left: 10.0, right: 10.0),
      duration: const Duration(seconds: 2),
      icon: const Icon(Icons.error, color: Colors.white),
    );
  }

  @override
  void showSuccessSnackBar({String title = "", String message = ""}) {
    Get.snackbar(
      title,
      message,
      backgroundColor: Colors.green,
      barBlur: 10.0,
      snackPosition: SnackPosition.TOP,
      margin: const EdgeInsets.only(bottom: 10.0, left: 10.0, right: 10.0),
      duration: const Duration(seconds: 2),
      icon: const Icon(Icons.check_circle, color: Colors.white),
    );
  }

  @override
  void showSimpleSnackBar({String message = ""}) {
    Get.showSnackbar(
      GetSnackBar(
        messageText: Text(message, style: const TextStyle(color: Colors.white)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  void showSimpleErrorSnackBar({
    String message = "",
    Duration? duration,
    bool isDismissible = true,
  }) {
    if (Get.isSnackbarOpen) {
      return;
    }
    Get.showSnackbar(
      GetSnackBar(
        snackPosition: SnackPosition.TOP,
        backgroundColor: Colors.red,
        barBlur: 10.0,
        borderRadius: 12.r,
        isDismissible: isDismissible,
        margin: EdgeInsets.symmetric(horizontal: 20.w),
        icon: Icon(
          Icons.error,
          color: Colors.red,
          size: 24.r,
        ),
        messageText: Text(
          message,
        ),
        duration: duration ?? const Duration(seconds: 3),
      ),
    );
  }

  @override
  void showSimpleSuccessSnackBar({String message = ""}) {
    if (Get.isSnackbarOpen) {
      return;
    }
    Get.showSnackbar(
      GetSnackBar(
        snackPosition: SnackPosition.TOP,
        backgroundColor: Colors.green,
        barBlur: 10.0,
        borderRadius: 12.r,
        margin: EdgeInsets.symmetric(
          horizontal: 20.w,
        ),
        icon: Icon(
          Icons.check_circle,
          color: Colors.white,
          size: 24.r,
        ),
        messageText: Text(
          message,
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  void hideLoadingDialog() {

  }

  @override
  void showLoadingDialog() {
  }

  void showAlert({
    String title = "Alert",
    TextStyle? titleStyle,
    Widget? content,
    VoidCallback? onConfirm,
    VoidCallback? onCancel,
    VoidCallback? onCustom,
    Color? cancelTextColor,
    Color? confirmTextColor,
    String? textConfirm,
    String? textCancel,
    String? textCustom,
    Widget? confirm,
    Widget? cancel,
    Widget? custom,
    Color? backgroundColor,
    bool barrierDismissible = true,
    Color? buttonColor,
    String middleText = "",
    TextStyle? middleTextStyle,
    double radius = 20.0,
    List<Widget>? actions,
    WillPopCallback? onWillPop,
  }) {
    Get.defaultDialog(
      title: title,
      titleStyle: titleStyle,
      content: content,
      onConfirm: onConfirm,
      onCancel: onCancel,
      onCustom: onCustom,
      cancelTextColor: cancelTextColor,
      confirmTextColor: confirmTextColor,
      textConfirm: textConfirm,
      textCancel: textCancel,
      textCustom: textCustom,
      confirm: confirm,
      cancel: cancel,
      custom: custom,
      backgroundColor: backgroundColor,
      barrierDismissible: barrierDismissible,
      buttonColor: buttonColor,
      middleText: middleText,
      middleTextStyle: middleTextStyle,
      radius: radius,
      actions: actions,
      onWillPop: onWillPop,
    );
  }
}

abstract class CustomWidgets {
  void showSnackBar({String title = "", String message = ""}) {}

  void showErrorSnackBar({String title = "", String message = ""}) {}

  void showSuccessSnackBar({String title = "", String message = ""}) {}

  void showSimpleSnackBar({String message = ""}) {}

  void showSimpleErrorSnackBar({String message = ""}) {}

  void showSimpleSuccessSnackBar({String message = ""}) {}

  void showLoadingDialog() {}

  void hideLoadingDialog() {}
}
