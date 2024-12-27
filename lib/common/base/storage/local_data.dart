import 'package:get_storage/get_storage.dart';

class LocalData {
  static final shared = LocalData();

  final isFirstRunApp = ReadWriteValue(Keys.isFirstRun, true);
  final tokenData = ReadWriteValue(Keys.token, '');

  bool? _isFirstRun;

  bool get isLogged => GetStorage().hasData(Keys.token) && tokenData.val.isNotEmpty;

  Future<void> removeLocalData(String key) async {
    await GetStorage().remove(key);
  }

  Future<bool> isFirstRun() async {
    if (_isFirstRun != null) {
      return _isFirstRun!;
    } else {
      bool isFirstRun;
      try {
        isFirstRun = isFirstRunApp.val;
      } on Exception {
        isFirstRun = true;
      }
      isFirstRunApp.val = false;
      _isFirstRun ??= isFirstRun;
      return isFirstRun;
    }
  }
}

class Keys {
  static const isFirstRun = "isFirstRun";
  static const token = 'userToken';
}
