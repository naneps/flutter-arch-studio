// ── core files shared across architectures ──

export function genMainDart(state, feats) {
  return `import 'package:flutter/material.dart';
${state === 'riverpod' ? "import 'package:flutter_riverpod/flutter_riverpod.dart';" : ''}
${state === 'getx' ? "import 'package:get/get.dart';" : ''}
${feats.includes('firebase') ? "import 'package:firebase_core/firebase_core.dart';" : ''}
${feats.includes('storage') ? "import 'package:hive_flutter/hive_flutter.dart';" : ''}
${feats.includes('env') ? "import 'package:flutter_dotenv/flutter_dotenv.dart';" : ''}
${state !== 'getx' && state !== 'riverpod' ? "import 'injection_container.dart';" : ''}
import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
${feats.includes('env') ? "  await dotenv.load(fileName: '.env');" : ''}
${feats.includes('firebase') ? "  await Firebase.initializeApp();" : ''}
${feats.includes('storage') ? "  await Hive.initFlutter();" : ''}
${state !== 'getx' && state !== 'riverpod' ? "  await configureDependencies();" : ''}
  runApp(${state === 'riverpod' ? 'const ProviderScope(child: MyApp())' : 'const MyApp()'});
}
`
}

export function genAppDart(state, feats, hasRouter) {
  const routerImport = hasRouter
    ? (state === 'getx' ? '' : "import 'core/router/app_router.dart';")
    : ''

  if (state === 'getx') {
    return `import 'package:flutter/material.dart';
import 'package:get/get.dart';
${feats.includes('theme') ? "import 'core/theme/app_theme.dart';" : ''}
import 'routes.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'My App',
      debugShowCheckedModeBanner: false,
      ${feats.includes('theme') ? 'theme: AppTheme.light,' : ''}
      ${feats.includes('theme') ? 'darkTheme: AppTheme.dark,' : ''}
      initialRoute: AppRoutes.home,
      getPages: AppRoutes.pages,
    );
  }
}
`
  }

  if (hasRouter) {
    return `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
${feats.includes('theme') ? "import 'core/theme/app_theme.dart';" : ''}
${routerImport}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'My App',
      debugShowCheckedModeBanner: false,
      ${feats.includes('theme') ? 'theme: AppTheme.light,' : ''}
      ${feats.includes('theme') ? 'darkTheme: AppTheme.dark,' : ''}
      routerConfig: appRouter,
    );
  }
}
`
  }

  return `import 'package:flutter/material.dart';
${feats.includes('theme') ? "import 'core/theme/app_theme.dart';" : ''}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      debugShowCheckedModeBanner: false,
      ${feats.includes('theme') ? 'theme: AppTheme.light,' : ''}
      ${feats.includes('theme') ? 'darkTheme: AppTheme.dark,' : ''}
      home: const Scaffold(body: Center(child: Text('Hello Flutter!'))),
    );
  }
}
`
}

export function genTheme() {
  return `import 'package:flutter/material.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get light => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF6750A4),
      brightness: Brightness.light,
    ),
    inputDecorationTheme: const InputDecorationTheme(
      border: OutlineInputBorder(),
    ),
  );

  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF6750A4),
      brightness: Brightness.dark,
    ),
    inputDecorationTheme: const InputDecorationTheme(
      border: OutlineInputBorder(),
    ),
  );
}
`
}

export function genRouter(feats, arch) {
  const authImport = feats.includes('auth')
    ? arch === 'mvc'
      ? "import 'views/login_view.dart';"
      : arch === 'feature'
        ? "import 'features/auth/ui/login_screen.dart';"
        : "import 'features/auth/presentation/pages/login_page.dart';"
    : ''

  return `import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
${authImport}

final appRouter = GoRouter(
  initialLocation: '/',
  debugLogDiagnostics: true,
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const Scaffold(
        body: Center(child: Text('Home')),
      ),
    ),
${feats.includes('auth') ? `    GoRoute(
      path: '/login',
      name: 'login',
      builder: (context, state) => const ${arch === 'mvc' ? 'LoginView' : arch === 'feature' ? 'LoginScreen' : 'LoginPage'}(),
    ),` : ''}
  ],
);
`
}

export function genDioClient(feats) {
  return `import 'package:dio/dio.dart';
${feats.includes('env') ? "import '../constants/env.dart';" : ''}

class DioClient {
  late final Dio _dio;
  static DioClient? _instance;

  DioClient._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: ${feats.includes('env') ? 'Env.apiBaseUrl' : "'https://api.example.com'"},
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.addAll([
      AuthInterceptor(),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (o) => debugPrint(o.toString()),
      ),
    ]);
  }

  factory DioClient() => _instance ??= DioClient._internal();
  Dio get dio => _dio;
}
`
}

export function genAuthInterceptor() {
  return `import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // TODO: get token from secure storage
    // final token = GetIt.I<LocalStorage>().getToken();
    // if (token != null) {
    //   options.headers['Authorization'] = 'Bearer \$token';
    // }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // TODO: refresh token or redirect to login
      debugPrint('Unauthorized - redirect to login');
    }
    handler.next(err);
  }
}
`
}

export function genFailures() {
  return `import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Server error occurred']);
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'No internet connection']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Cache error occurred']);
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure([super.message = 'Unauthorized']);
}
`
}

export function genExceptions() {
  return `class ServerException implements Exception {
  final String message;
  final int? statusCode;
  const ServerException({this.message = 'Server error', this.statusCode});
  
  @override
  String toString() => 'ServerException: \$message (status: \$statusCode)';
}

class CacheException implements Exception {
  final String message;
  const CacheException([this.message = 'Cache error occurred']);
}

class NetworkException implements Exception {
  final String message;
  const NetworkException([this.message = 'Network error occurred']);
}
`
}

export function genUseCase() {
  return `import 'package:dartz/dartz.dart';
import '../error/failures.dart';

abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

/// Use when a use case has no parameters
class NoParams {
  const NoParams();
}
`
}

export function genEnv() {
  return `import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  Env._();

  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'https://api.example.com';

  static String get apiKey =>
      dotenv.env['API_KEY'] ?? '';

  static bool get isProduction =>
      dotenv.env['ENVIRONMENT'] == 'production';
}
`
}

export function genDotEnv() {
  return `# Environment Configuration
# DO NOT COMMIT THIS FILE TO GIT

API_BASE_URL=https://api.example.com
API_KEY=your_api_key_here
ENVIRONMENT=development
`
}

export function genGitignore() {
  return `.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.iml

# macOS
.DS_Store
`
}

export function genAnalysisOptions(feats) {
  const isStrict = feats.includes('lints')
  return `include: package:flutter_lints/flutter.yaml

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"

linter:
  rules:
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - avoid_print
${isStrict ? `    - prefer_single_quotes
    - require_trailing_commas
    - sort_child_properties_last
    - use_super_parameters
    - always_declare_return_types
    - always_specify_types
    - unawaited_futures` : ''}
`
}

export function genReadme(projectName, arch, state, feats) {
  const buildRunner = state === 'bloc' || state === 'riverpod'
  return `# ${projectName}

> Generated by **Flutter Arch Studio** 🏗️

## Stack

| Layer | Choice |
|-------|--------|
| Architecture | ${arch.toUpperCase()} |
| State Management | ${state.toUpperCase()} |
| Features | ${feats.join(', ')} |

## Getting Started

\`\`\`bash
# 1. Install dependencies
flutter pub get

${buildRunner ? `# 2. Generate code (injectable, riverpod, json_serializable)
flutter pub run build_runner build --delete-conflicting-outputs

` : ''}# ${buildRunner ? '3' : '2'}. Run the app
flutter run
\`\`\`

${feats.includes('env') ? `## Environment Setup

\`\`\`bash
# Copy the example env file
cp .env.example .env

# Edit with your values
nano .env
\`\`\`
` : ''}

## Project Structure

This project uses **${arch}** architecture with **${state}** state management.
${arch === 'clean' ? `
### Layers

- \`core/\` — Shared utilities, error handling, network, DI
- \`features/\`
  - \`domain/\` — Entities, repository interfaces, use cases (pure Dart)
  - \`data/\` — Repository implementations, data sources, models
  - \`presentation/\` — UI, state management (bloc/cubit/etc)
` : ''}

## Testing

\`\`\`bash
flutter test
\`\`\`
`
}
