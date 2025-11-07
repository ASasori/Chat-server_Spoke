import 'package:flutter/material.dart';

import '../../../resource/theme/app_colors.dart';
import '../../../resource/theme/app_style.dart';
import '../../../utils/extension_utils.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AppTextFiled extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final String? errorText;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final EdgeInsetsGeometry? contentPadding;
  final FormFieldValidator<String>? validator;
  final Color? fillColor;
  final String? labelText;
  final String? labelTextOptional;
  final TextStyle? labelStyle;
  final bool? isRequired;
  final ValueChanged<String>? onChanged;
  final bool? isReadOnly;
  final Function()? onTap;

  const AppTextFiled({
    super.key,
    this.controller,
    this.hintText,
    this.errorText,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
    this.suffixIcon,
    this.prefixIcon,
    this.contentPadding,
    this.validator,
    this.fillColor,
    this.labelText,
    this.labelTextOptional,
    this.labelStyle,
    this.isRequired,
    this.onChanged,
    this.onTap,
    this.isReadOnly,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (labelText!.isNotEmpty)
          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: labelText.nullToEmpty,
                  style: labelStyle ??
                      AppStyles.STYLE_14.copyWith(
                          color: AppColors.color0E0E15,
                          fontWeight: FontWeight.w600
                      ),
                ),
                TextSpan(
                  text:
                  isRequired == false ? labelTextOptional.nullToEmpty : '*',
                  style: AppStyles.STYLE_14.copyWith(
                    color: AppColors.colorFF2D2D,
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 8),
        TextFormField(
          onTap: onTap,
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: validator,
          onChanged: onChanged,
          cursorColor: AppColors.color0E0E15,
          style: AppStyles.STYLE_14.copyWith(color: AppColors.color0E0E15),
          readOnly: isReadOnly ?? false,
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle:
            AppStyles.STYLE_14.copyWith(color: AppColors.colorBDBDBD),
            errorText: errorText,
            errorStyle:
            AppStyles.STYLE_12.copyWith(color: AppColors.errorColor),
            suffixIcon: suffixIcon,
            prefixIcon: prefixIcon,
            contentPadding: contentPadding,
            enabledBorder: _buildOutlineInputBorder(AppColors.colorBDBDBD),
            focusedBorder: _buildOutlineInputBorder(AppColors.colorBDBDBD),
            errorBorder: _buildOutlineInputBorder(AppColors.errorColor),
            focusedErrorBorder: _buildOutlineInputBorder(AppColors.errorColor),
            fillColor: fillColor ?? AppColors.white,
            filled: true,
          ),
        ),
      ],
    );
  }

  OutlineInputBorder _buildOutlineInputBorder(Color borderColor) {
    return OutlineInputBorder(
      borderSide: BorderSide(color: borderColor, width: 1.h),
      borderRadius: BorderRadius.circular(6.h),
    );
  }
}
