import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:badges/badges.dart' as badges;
import 'package:get/get.dart';

import '../../../resource/asset/app_images.dart';
import '../../../resource/theme/app_colors.dart';
import '../../../resource/theme/app_style.dart';

class CustomNavigationBar extends StatelessWidget {
  final List<bool> isSelectedList;
  final Function(int) onItemTapped;

  const CustomNavigationBar({
    Key? key,
    required this.isSelectedList,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      decoration: BoxDecoration(
        color: AppColors.white,
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            iconPath: AppImages.icHome,
            label: 'home'.tr,
            isSelected: isSelectedList[0],
            onTap: () => onItemTapped(0),
          ),
          _buildNavItem(
            iconPath: AppImages.icAward,
            label: 'order'.tr,
            isSelected: isSelectedList[1],
            onTap: () => onItemTapped(1),
          ),
          _buildNavItem(
            iconPath: AppImages.icNews,
            label: 'profile'.tr,
            isSelected: isSelectedList[2],
            onTap: () => onItemTapped(2),
          ),
          _buildNavItem(
            iconPath: AppImages.icProfile,
            label: 'notification'.tr,
            isSelected: isSelectedList[3],
            onTap: () => onItemTapped(3),
          ),
          _buildNavItem(
            iconPath: AppImages.icSetting,
            label: 'notification'.tr,
            isSelected: isSelectedList[4],
            onTap: () => onItemTapped(4),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required String iconPath,
    required String label,
    required bool isSelected,
    String? badgeContent,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (badgeContent != null)
            badges.Badge(
              badgeContent: Text(
                badgeContent,
                style: AppStyles.STYLE_10.copyWith(color: AppColors.white),
              ),
              badgeStyle: const badges.BadgeStyle(
                badgeColor: Colors.red,
              ),
              child: SvgPicture.asset(
                iconPath,
                height: 24,
                width: 24,
                colorFilter: ColorFilter.mode(
                    isSelected
                        ? AppColors.isSelectedNavBarColor
                        : AppColors.isNotSelectedNavBarColor,
                    BlendMode.srcIn),
              ),
            )
          else
            SvgPicture.asset(
              iconPath,
              height: 24,
              width: 24,
              colorFilter: ColorFilter.mode(
                isSelected
                    ? AppColors.isSelectedNavBarColor
                    : AppColors.isNotSelectedNavBarColor,
                BlendMode.srcIn,
              ),
            ),
          SizedBox(height: 4.h),
          Text(
            label,
            style: AppStyles.STYLE_12.copyWith(
              color: isSelected
                  ? AppColors.isSelectedNavBarColor
                  : AppColors.isNotSelectedNavBarColor,
            ),
          ),
        ],
      ),
    );
  }
}
