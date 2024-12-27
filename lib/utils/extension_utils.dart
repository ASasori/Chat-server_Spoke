import 'dart:convert';
import 'dart:math';

import 'package:flutter/services.dart';

extension NullableNum on num? {
  num get nullToZero => this ?? 0;
}

extension NullableInt on int? {
  int get nullToZero => this ?? 0;

  int get millisecond => nullToZero * 1000;

  bool get isTrue => (this ?? 0) >= 1;

  bool get isFalse => (this ?? 0) < 1;
}

extension NullableDouble on double? {
  double get nullToZero => this ?? 0.0;
}

extension NullableExt on dynamic {
  bool get isNullOrEmpty => this == null || this == '';
}

extension BooleanExt on bool? {
  bool get isTrue => this != null && this == true;

  bool get isFalse => this != true;
}

extension StringExt on String? {
  dynamic toJson() => jsonDecode(this ?? '');

  String get nullToEmpty => this ?? '';

  String get nullToZero => this ?? "0";

  bool get isNullOrEmpty => this == null || this == '';

  double get parseDouble => double.tryParse(this ?? '') ?? 0;

  int get parseInt => int.tryParse(this ?? '') ?? 0;
}

extension NullableListExt on List? {
  bool get isListNullOrEmpty => this == null || (this ?? []).isEmpty;
}

extension StringCasingExtension on String {
  String toCapitalized() => length > 0 ? '${this[0].toUpperCase()}${substring(1)}' : '';

  String toTitleCase() => replaceAll(RegExp(' +'), ' ').split(' ').map((str) => str.toCapitalized()).join(' ');
}

String replaceCharAt(String oldString, int index, String newChar) {
  return oldString.substring(0, index) + newChar + oldString.substring(index + 1);
}

String ellipsisString(String? text, int limit) {
  if (text.isNullOrEmpty) {
    return "";
  }
  if (text!.length > limit) {
    return "${text.substring(0, limit)}...";
  }
  return text;
}

extension Range on num {
  bool isBetween(num from, num to) {
    return from < this && this < to;
  }
}

extension ExtendList<T> on List<T> {
  void extend(int newLength, T defaultValue) {
    assert(newLength >= 0);

    final lengthDifference = newLength - length;
    if (lengthDifference <= 0) {
      return;
    }

    addAll(List.filled(lengthDifference, defaultValue));
  }

  T? getOrNull(int index) {
    return (index < length) ? this[index] : null;
  }
}

Future<String> loadAsset(String fileName) async {
  return rootBundle.loadString('assets/$fileName');
}

int random(int min, int max) {
  return min + Random().nextInt(max - min);
}

double doubleInRange(Random source, num start, num end) => source.nextDouble() * (end - start) + start;


T? tryCast<T>(dynamic value, {T? fallback}) {
  try {
    return (value as T);
  } on TypeError catch (_) {
    return fallback;
  }
}

class RandomArray {
  List<String> originalArray;
  List<String> tempArray;
  final List<String> _chosenItems = [];
  Random randomGenerator = Random();

  RandomArray._internal(List<String> arr)
      : originalArray = List.from(arr),
        tempArray = List.from(arr);

  static final Map<String, RandomArray> _cache = {};

  factory RandomArray(String key, List<String> arr) {
    return _cache.putIfAbsent(key, () => RandomArray._internal(arr));
  }

  String random() {
    if (tempArray.isEmpty) {
      tempArray = List.from(originalArray);
      _chosenItems.clear();
    }

    int randomIndex = randomGenerator.nextInt(tempArray.length);
    String randomItem = tempArray[randomIndex];
    tempArray.removeAt(randomIndex);
    _chosenItems.add(randomItem);

    return randomItem;
  }

  bool get hasMoreItems => tempArray.isNotEmpty;
}
