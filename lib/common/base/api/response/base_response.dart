import 'dart:convert';

class BaseResponse<T> {
  BaseResponse({this.status = '', this.messages, this.code, this.body});

  String? status = '';
  String? messages;
  int? code;
  T? body;

  factory BaseResponse.fromJson(String str) => BaseResponse.fromMap(json.decode(str));

  String toJson() => json.encode(toMap());

  factory BaseResponse.fromMap(Map<String, dynamic> json) => BaseResponse(
        status: json["status"],
        code: json["code"],
        messages: json["messages"],
      );

  Map<String, dynamic> toMap() => {
        "status": status,
        "code": code,
        "messages": messages,
      };

  @override
  String toString() {
    return 'Result{status: $status, code: $code, messages: $messages, body: $body}';
  }
}
