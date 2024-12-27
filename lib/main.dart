import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:tekup_connection_mobile/app/app_bindings.dart';
import 'package:tekup_connection_mobile/common/constants.dart';
import 'package:tekup_connection_mobile/resource/lang/translate_service.dart';
import 'package:tekup_connection_mobile/resource/theme/app_theme.dart';
import 'package:tekup_connection_mobile/routes/app_routes.dart';

Future<void> main() async {
  await init();
  runApp(const App(initialRoute: PageName.splashPage));
}

Future<void> init() async {
  WidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = MyHttpOverrides();
}

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..maxConnectionsPerHost = 6
      ..connectionTimeout = const Duration(minutes: 1)
      ..idleTimeout = const Duration(minutes: 1)
      ..badCertificateCallback = (_, __, ___) => true;
  }
}
class App extends StatelessWidget {
  final String initialRoute;

  const App({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(411, 823),
      minTextAdapt: true,
      splitScreenMode: true,
      useInheritedMediaQuery: true,
      rebuildFactor: RebuildFactors.orientation,
      fontSizeResolver: FontSizeResolvers.height,
      builder: (context, child) => GetMaterialApp(
        debugShowCheckedModeBanner: false,
        defaultTransition: Transition.rightToLeftWithFade,
        getPages: AppPages.routes,
        initialBinding: AppBindings(),
        smartManagement: SmartManagement.keepFactory,
        title: Constants.appName,
        locale: TranslationService.locale,
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          DefaultCupertinoLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        fallbackLocale: TranslationService.fallbackLocale,
        translations: TranslationService(),
        initialRoute: initialRoute,
        theme: AppTheme.dark,
        darkTheme: AppTheme.dark,
      ),
    );
  }
}