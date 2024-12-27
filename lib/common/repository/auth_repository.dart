import 'package:tekup_connection_mobile/common/base/api/response/base_response.dart';

abstract class AuthRepository{

  Future<BaseResponse> login({Map<String, dynamic>? body});
}