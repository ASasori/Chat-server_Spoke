import 'package:tekup_connection_mobile/common/base/api/api_connect.dart';
import 'package:tekup_connection_mobile/common/base/api/response/base_response.dart';

class ApiService {
  static final ApiConnect apiConnect = ApiConnect();

  Future<BaseResponse> getData({
    required String endPoint,
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
  }) async {
    query ??= {};
    return apiConnect.getData(endPoint: endPoint, query: query, header: header);
  }

  Future<BaseResponse> deleteData({
    required String endPoint,
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    return apiConnect.deleteData(endPoint: endPoint, query: query, data: data, header: header);
  }

  Future<BaseResponse> postData({
    required String endPoint,
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    query ??= {};
    return apiConnect.postData(endPoint: endPoint, query: query, data: data, header: header);
  }

  Future<BaseResponse> putData({
    required String endPoint,
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    return apiConnect.putData(endPoint: endPoint, query: query, data: data, header: header);
  }

  Future<BaseResponse> getUriData({
    required String url,
    Map<String, dynamic> header = const {},
  }) async {
    return apiConnect.getUriData(url: url, header: header);
  }

  Future<BaseResponse> postUriData({
    required String url,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    return apiConnect.postUriData(url: url, header: header, data: data);
  }

  Future<BaseResponse> patchData({
    required String endPoint,
    Map<String, dynamic>? query,
    Map<String, dynamic> header = const {},
    Map<String, dynamic>? data,
  }) async {
    return apiConnect.patchData(endPoint: endPoint, query: query, data: data, header: header);
  }
}
