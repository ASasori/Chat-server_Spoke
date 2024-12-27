import 'dart:async';

import 'package:dio/dio.dart';
import 'package:tekup_connection_mobile/common/base/storage/local_data.dart';

const _headerAccept = "Accept";
const _headerAuthorization = 'Authorization';

class ApiInterceptor extends InterceptorsWrapper {
  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    setHeaderRequest(options);
    return handler.next(options);
  }

  Future<void> setHeaderRequest(RequestOptions options) async {
    options.headers[_headerAccept] = "application/json";
    if (LocalData.shared.isLogged == true) {
      options.headers[_headerAuthorization] = 'Bearer ${LocalData.shared.tokenData.val}';
    }
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    return super.onError(err, handler);
  }
}
