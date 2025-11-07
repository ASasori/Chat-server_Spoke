import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:tekup_connection_mobile/common/base/widgets/app_text_field.dart';
import 'package:tekup_connection_mobile/common/base/widgets/base_page_widget.dart';
import 'package:tekup_connection_mobile/resource/asset/app_images.dart';
import 'package:tekup_connection_mobile/resource/theme/app_colors.dart';
import 'package:tekup_connection_mobile/resource/theme/app_style.dart';
import 'package:tekup_connection_mobile/ui/login/controller/login_controller.dart';

class LoginPage extends BasePage<LoginController> {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.greenAccent,
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 150.h),
            Text(
              "AKE",
              style: AppStyles.STYLE_28_BOLD.copyWith(
                color: AppColors.white,
              ),
            ),
            SizedBox(height: 80.h),
            Container(
              width: double.infinity,
              height: 0.7.sh,
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(40.r),
                    topRight: Radius.circular(40.r)),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.black.withOpacity(0.05),
                    offset: const Offset(0.3, 0.3),
                    blurRadius: 8.0,
                  ),
                ],
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.w),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(height: 20.h),
                    Text(
                      "Login",
                      style: AppStyles.STYLE_24_BOLD.copyWith(
                        color: AppColors.black,
                      ),
                    ),
                    Text(
                      "subTitle".tr,
                      style: AppStyles.STYLE_12.copyWith(
                        color: AppColors.black,
                      ),
                    ),
                    SizedBox(height: 25.h),
                    _buildInputSection(),
                    SizedBox(height: 40.h),
                    Text(
                      "App Button Green",
                      style: AppStyles.STYLE_24_BOLD.copyWith(
                        color: AppColors.black,
                      ),
                    ),
                    Text(
                      "${"forgotPassword".tr} ?",
                      style: AppStyles.STYLE_12.copyWith(
                        color: AppColors.black,
                      ),
                    ),
                    SizedBox(height: 10.h),
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: "noAccount".tr,
                            style: AppStyles.STYLE_12.copyWith(
                              color: AppColors.black,
                            ),
                          ),
                          TextSpan(
                            text: " ${"signUp".tr}",
                            style: AppStyles.STYLE_12.copyWith(
                              color: AppColors.colorFF7E5F,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        AppTextFiled(
          labelText: "email".tr,
          hintText: "enterEmail".tr,
        ),
        SizedBox(height: 10.h),
        Obx(
          () => AppTextFiled(
            labelText: "password".tr,
            obscureText: controller.isShowPassword.value,
            suffixIcon: InkWell(
              onTap: controller.toggleShowPassword,
              child: SvgPicture.asset(
                controller.isShowPassword.value
                    ? AppImages.icEyeSlash
                    : AppImages.icEye,
                height: 24.w,
                width: 24.w,
                fit: BoxFit.scaleDown,
              ),
            ),
            hintText: "enterPassword".tr,
          ),
        ),
      ],
    );
  }
}
