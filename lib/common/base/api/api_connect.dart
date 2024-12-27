import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'package:flutter/foundation.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:tekup_connection_mobile/common/base/api/interceptor/api_interceptor.dart';
import 'package:tekup_connection_mobile/common/base/api/response/base_response.dart';

class ApiConnect with DioMixin implements Dio {
  final baseUrl = ApiConstants.baseUrlDev;

  ApiConnect([BaseOptions? options]) {
    options = BaseOptions(
      baseUrl: baseUrl,
      contentType: ApiConstants.contentType,
      connectTimeout: const Duration(milliseconds: ApiConstants.timeOut),
      sendTimeout: const Duration(milliseconds: ApiConstants.timeOut),
      receiveTimeout: const Duration(milliseconds: ApiConstants.timeOut),
    );
    this.options = options;

    interceptors.add(ApiInterceptor());
    if (kDebugMode) {
      interceptors.add(
        PrettyDioLogger(
          requestHeader: ApiConstants.enableLog,
          requestBody: ApiConstants.enableLog,
          responseBody: ApiConstants.enableLog,
          maxWidth: 200,
        ),
      );
    }
    httpClientAdapter = IOHttpClientAdapter();
  }

  Future<BaseResponse> getData({
    String endPoint = "",
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? query,
  }) async {
    final customOptions = Options(headers: header);
    var res =
        await get(endPoint, queryParameters: query, options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> getUriData(
      {String url = "", Map<String, dynamic> header = const {}}) async {
    final customOptions = Options(headers: header);
    final res = await getUri(Uri.parse(url), options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> postUriData(
      {String url = "",
      Map<String, dynamic> header = const {},
      Map<String, dynamic>? data}) async {
    final customOptions = Options(headers: header);
    final res =
        await postUri(Uri.parse(url), data: data, options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> postData({
    String endPoint = "",
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? query,
    Map<String, dynamic>? data,
  }) async {
    final customOptions = Options(headers: header);
    final res = await post(endPoint,
        data: data, queryParameters: query, options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> putData({
    String endPoint = "",
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    final customOptions = Options(headers: header);
    final res = await put(endPoint,
        data: data, queryParameters: query, options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> patchData({
    String endPoint = "",
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    final customOptions = Options(headers: header);
    final res = await patch(endPoint,
        data: data, queryParameters: query, options: customOptions);
    return _convertResponseToResult(res);
  }

  Future<BaseResponse> deleteData({
    String endPoint = "",
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? query,
    Map<String, dynamic>? data,
  }) async {
    final customOptions = Options(headers: header);
    final res = await delete(endPoint,
        data: data, queryParameters: query, options: customOptions);
    return _convertResponseToResult(res);
  }

  _convertResponseToResult(Response response) {
    final code = response.statusCode ?? 0;
    if (code >= 200 && code <= 299) {
      return BaseResponse(status: ApiConstants.isOk, body: response.data);
    } else {
      return BaseResponse(
        status: ApiConstants.isOk,
        code: response.statusCode,
        messages: response.statusMessage,
      );
    }
  }
}

class ApiConstants {
  static const String isOk = "OK";
  static const String isError = "ERROR";
  static const int timeOut = 60000;
  static const String contentType = "application/json; charset=utf-8";
  static const bool enableLog = true;
  static const String baseUrlPro = 'https://google.com/';
  static const String baseUrlDev = 'https://google.com/';
}
