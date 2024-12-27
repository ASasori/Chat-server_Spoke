import 'package:get_storage/get_storage.dart';

class DependencyInjection {
  static Future<void> init() async {
    await GetStorage.init();
  }
}
