import 'package:flutter/material.dart';

class AppTheme {
  static final light = ThemeData.light().copyWith(
    extensions: [
      _lightAppColors,
    ],
  );

  static const _lightAppColors = AppColorsExtension(
    primary: Color(0xFFE53F34),
    background: Color(0xFF181A20),
    text: Color(0xFFFFFFFF),
    navBar: Color(0xFF000000),
    subText: Color(0x4DFFFFFF),
    hint: Color(0xFFA3A3A6),
    cardBackground: Color(0xFF1F222A),
    inputBackground: Color(0xFF45464B),
    viewMore: Color(0xFF23252B),
    highlight: Color(0xFFE53F34),
  );

  static final dark = ThemeData.dark().copyWith(
    extensions: [
      _darkAppColors,
    ],
  );

  static const _darkAppColors = AppColorsExtension(
    primary: Color(0xFFE53F34),
    background: Color(0xFF181A20),
    text: Color(0xFFFFFFFF),
    navBar: Color(0xFF000000),
    subText: Color(0x99FFFFFF),
    hint: Color(0xFFA3A3A6),
    cardBackground: Color(0xFF1F222A),
    inputBackground: Color(0xFF45464B),
    viewMore: Color(0xFF23252B),
    highlight: Color(0xFFE53F34),
  );
}

@immutable
class AppColorsExtension extends ThemeExtension<AppColorsExtension> {
  const AppColorsExtension({
    required this.primary,
    required this.background,
    required this.text,
    required this.subText,
    required this.navBar,
    required this.hint,
    required this.cardBackground,
    required this.inputBackground,
    required this.viewMore,
    required this.highlight,
  });

  final Color primary;
  final Color background;
  final Color text;
  final Color subText;
  final Color navBar;
  final Color hint;
  final Color cardBackground;
  final Color inputBackground;
  final Color viewMore;
  final Color highlight;

  @override
  ThemeExtension<AppColorsExtension> copyWith({
    Color? primary,
    Color? background,
    Color? text,
    Color? subText,
    Color? navBar,
    Color? hint,
    Color? cardBackground,
    Color? inputBackground,
    Color? viewMore,
    Color? highlight,
  }) {
    return AppColorsExtension(
      primary: primary ?? this.primary,
      background: background ?? this.background,
      text: text ?? this.text,
      subText: subText ?? this.subText,
      navBar: navBar ?? this.navBar,
      hint: hint ?? this.hint,
      cardBackground: cardBackground ?? this.cardBackground,
      inputBackground: inputBackground ?? this.inputBackground,
      viewMore: viewMore ?? this.viewMore,
      highlight: highlight ?? this.highlight,
    );
  }

  @override
  ThemeExtension<AppColorsExtension> lerp(
      covariant ThemeExtension<AppColorsExtension>? other,
      double t,
      ) {
    if (other is! AppColorsExtension) {
      return this;
    }

    return AppColorsExtension(
      primary: Color.lerp(primary, other.primary, t)!,
      background: Color.lerp(background, other.background, t)!,
      text: Color.lerp(text, other.text, t)!,
      navBar: Color.lerp(navBar, other.navBar, t)!,
      subText: Color.lerp(subText, other.subText, t)!,
      hint: Color.lerp(hint, other.hint, t)!,
      cardBackground: Color.lerp(cardBackground, other.cardBackground, t)!,
      inputBackground: Color.lerp(inputBackground, other.inputBackground, t)!,
      viewMore: Color.lerp(viewMore, other.viewMore, t)!,
      highlight: Color.lerp(highlight, other.highlight, t)!,
    );
  }
}

extension AppThemeExtension on ThemeData {
  AppColorsExtension get appColors => extension<AppColorsExtension>() ?? AppTheme._darkAppColors;
}
