import 'package:flutter/services.dart';

class AppOrientation {
  static Future<void> setOrientationFullScreen() async {
    await SystemChrome.setPreferredOrientations(DeviceOrientation.values);
  }

  static Future<void> setOrientationPortrait() async {
    await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  }

  static Future<void> setOrientationLandscape() async {
    await SystemChrome.setPreferredOrientations([DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight]);
  }

  static Future<void> hideSystemUIOverlays() async {
    await SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual, overlays: []);
  }

  static Future<void> showSystemUIOverlays() async {
    await SystemChrome.setEnabledSystemUIMode(SystemUiMode.manual, overlays: SystemUiOverlay.values);
  }

  static Future<void> setOrientationPortraitUp() async {
    await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  }

  static Future<void> setColorStatusBar(Color color) async {
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: color,
      ),
    );
  }
}
