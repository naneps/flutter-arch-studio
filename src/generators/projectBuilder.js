import {
    genAuthBloc,
    genAuthGetX,
    genAuthProvider,
    genAuthRemoteDataSource,
    genAuthRepository,
    genAuthRepositoryImpl,
    genAuthRiverpod,
    genLoginPage,
    genLoginUseCase,
    genUserEntity,
    genUserModel,
} from './authFeature.js'
import {
    genAnalysisOptions,
    genAppDart,
    genAuthInterceptor,
    genDioClient,
    genDotEnv,
    genEnv,
    genExceptions,
    genFailures,
    genGitignore,
    genMainDart,
    genReadme,
    genRouter,
    genTheme,
    genUseCase,
} from './coreFiles.js'
import { generatePubspec } from './pubspec.js'

// ── DI / Injection Container ──
function genInjectionContainer(state, feats) {
  const hasAuth = feats.includes('auth')
  const hasApi = feats.includes('api')

  return `import 'package:get_it/get_it.dart';
${hasApi ? "import 'core/network/dio_client.dart';" : ''}
${hasAuth ? `import 'features/auth/data/datasources/auth_remote_datasource.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/domain/repositories/auth_repository.dart';
import 'features/auth/domain/usecases/login_usecase.dart';` : ''}

final sl = GetIt.instance;

Future<void> configureDependencies() async {
  // ── Network ──
${hasApi ? `  sl.registerLazySingleton<DioClient>(() => DioClient());` : '  // Add network dependencies here'}

  // ── Auth ──
${hasAuth ? `  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(${hasApi ? 'sl<DioClient>().dio' : ''}),
  );
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl()),
  );
  sl.registerLazySingleton(() => LoginUseCase(sl()));` : '  // Add feature dependencies here'}
}
`
}

// ── MVVM specific ──
function buildMvvmFiles(state, feats) {
  const files = {}
  const hasAuth = feats.includes('auth')
  const hasApi = feats.includes('api')

  if (feats.includes('theme')) {
    files['lib/app/theme.dart'] = genTheme()
  }
  if (feats.includes('router')) {
    files['lib/app/routes.dart'] = genRouter(feats, 'mvvm')
  }
  if (hasApi) {
    files['lib/services/api_service.dart'] = genDioClient(feats)
  }
  if (hasAuth) {
    files['lib/models/user_model.dart'] = `class UserModel {
  final String id;
  final String email;
  final String name;
  final String? avatar;

  const UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.avatar,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] as String,
    email: json['email'] as String,
    name: json['name'] as String,
    avatar: json['avatar'] as String?,
  );

  Map<String, dynamic> toJson() => {'id': id, 'email': email, 'name': name};
}
`
    files['lib/services/auth_service.dart'] = `${hasApi ? "import 'package:dio/dio.dart';" : ''}
import '../models/user_model.dart';

class AuthService {
  ${hasApi ? 'final Dio _dio;\n  AuthService(this._dio);' : 'AuthService();'}

  Future<UserModel> login(String email, String password) async {
    ${hasApi ? `final response = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    return UserModel.fromJson(response.data['data']);` : `await Future.delayed(const Duration(milliseconds: 500));
    return UserModel(id: '1', email: email, name: 'User');`}
  }

  Future<void> logout() async {
    ${hasApi ? "await _dio.post('/auth/logout');" : '// TODO: clear session'}
  }
}
`

    if (state === 'bloc') {
      files['lib/viewmodels/auth_cubit.dart'] = `import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

part 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthService _authService;
  AuthCubit(this._authService) : super(const AuthInitial());

  Future<void> login(String email, String password) async {
    emit(const AuthLoading());
    try {
      final user = await _authService.login(email, password);
      emit(AuthSuccess(user));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  void logout() => emit(const AuthInitial());
}
`
      files['lib/viewmodels/auth_state.dart'] = `part of 'auth_cubit.dart';

abstract class AuthState { const AuthState(); }
class AuthInitial extends AuthState { const AuthInitial(); }
class AuthLoading extends AuthState { const AuthLoading(); }
class AuthSuccess extends AuthState {
  final UserModel user;
  const AuthSuccess(this.user);
}
class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
}
`
    } else if (state === 'riverpod') {
      files['lib/viewmodels/auth_notifier.dart'] = `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

part 'auth_notifier.g.dart';

@riverpod
AuthService authService(AuthServiceRef ref) => AuthService();

@riverpod
class AuthNotifier extends _\$AuthNotifier {
  @override
  AsyncValue<UserModel?> build() => const AsyncValue.data(null);

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(authServiceProvider).login(email, password),
    );
  }

  void logout() => state = const AsyncValue.data(null);
}
`
    } else if (state === 'provider') {
      files['lib/viewmodels/auth_viewmodel.dart'] = `import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthViewModel extends ChangeNotifier {
  final AuthService _service;
  AuthViewModel(this._service);

  UserModel? _user;
  bool _loading = false;
  String? _error;

  UserModel? get user => _user;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _loading = true; notifyListeners();
    try {
      _user = await _service.login(email, password);
      _error = null;
    } catch (e) { _error = e.toString(); }
    _loading = false; notifyListeners();
  }

  void logout() { _user = null; notifyListeners(); }
}
`
    } else if (state === 'getx') {
      files['lib/viewmodels/auth_controller.dart'] = `import 'package:get/get.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthController extends GetxController {
  final AuthService _service;
  AuthController(this._service);

  final Rx<UserModel?> user = Rx(null);
  final loading = false.obs;
  final error = ''.obs;

  Future<void> login(String email, String password) async {
    loading.value = true;
    try {
      user.value = await _service.login(email, password);
      Get.offAllNamed('/home');
    } catch (e) {
      error.value = e.toString();
    } finally { loading.value = false; }
  }
}
`
    }

    files['lib/views/auth/login_view.dart'] = `import 'package:flutter/material.dart';
class LoginView extends StatelessWidget {
  const LoginView({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Login')),
    body: const Center(child: Text('Login View — MVVM')),
  );
}
`
  }
  return files
}

// ── Feature-First specific ──
function buildFeatureFiles(state, feats) {
  const files = {}
  const hasAuth = feats.includes('auth')

  if (feats.includes('theme')) files['lib/shared/app_theme.dart'] = genTheme()
  if (feats.includes('api')) files['lib/shared/api_client.dart'] = genDioClient(feats)

  files['lib/shared/widgets/loading_widget.dart'] = `import 'package:flutter/material.dart';

class LoadingWidget extends StatelessWidget {
  final String? message;
  const LoadingWidget({super.key, this.message});

  @override
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const CircularProgressIndicator(),
        if (message != null) ...[
          const SizedBox(height: 12),
          Text(message!),
        ],
      ],
    ),
  );
}
`

  if (hasAuth) {
    files['lib/features/auth/auth_module.dart'] = `export 'ui/login_screen.dart';
`
    files['lib/features/auth/data/auth_repository.dart'] = `class AuthRepository {
  // TODO: inject Dio or FirebaseAuth

  Future<Map<String, dynamic>> login(String email, String password) async {
    // Replace with real API call
    await Future.delayed(const Duration(milliseconds: 500));
    return {'id': '1', 'email': email, 'name': 'User', 'token': 'abc123'};
  }

  Future<void> logout() async {
    // TODO: clear token from storage
  }
}
`

    if (state === 'bloc') {
      files['lib/features/auth/logic/auth_cubit.dart'] = `import 'package:flutter_bloc/flutter_bloc.dart';
import '../data/auth_repository.dart';

part 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthRepository _repo;
  AuthCubit(this._repo) : super(const AuthInitial());

  Future<void> login(String email, String password) async {
    emit(const AuthLoading());
    try {
      final data = await _repo.login(email, password);
      emit(AuthSuccess(data));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }
}
`
      files['lib/features/auth/logic/auth_state.dart'] = `part of 'auth_cubit.dart';

abstract class AuthState { const AuthState(); }
class AuthInitial extends AuthState { const AuthInitial(); }
class AuthLoading extends AuthState { const AuthLoading(); }
class AuthSuccess extends AuthState {
  final Map<String, dynamic> data;
  const AuthSuccess(this.data);
}
class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
}
`
    } else if (state === 'riverpod') {
      files['lib/features/auth/logic/auth_notifier.dart'] = `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../data/auth_repository.dart';

part 'auth_notifier.g.dart';

@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) => AuthRepository();

@riverpod
class AuthNotifier extends _\$AuthNotifier {
  @override
  AsyncValue<Map?> build() => const AsyncValue.data(null);

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(authRepositoryProvider).login(email, password),
    );
  }

  void logout() => state = const AsyncValue.data(null);
}
`
    } else if (state === 'getx') {
      files['lib/features/auth/logic/auth_controller.dart'] = `import 'package:get/get.dart';
import '../data/auth_repository.dart';

class AuthController extends GetxController {
  final _repo = AuthRepository();
  final isLoading = false.obs;
  final user = Rx<Map?>(null);
  final error = ''.obs;

  Future<void> login(String email, String password) async {
    isLoading.value = true; error.value = '';
    try {
      user.value = await _repo.login(email, password);
      Get.offAllNamed('/home');
    } catch (e) {
      error.value = e.toString();
    } finally { isLoading.value = false; }
  }

  void logout() { user.value = null; Get.offAllNamed('/login'); }
}
`
    } else if (state === 'provider') {
      files['lib/features/auth/logic/auth_notifier.dart'] = `import 'package:flutter/foundation.dart';
import '../data/auth_repository.dart';

class AuthNotifier extends ChangeNotifier {
  final _repo = AuthRepository();
  Map? _user;
  bool _loading = false;
  String? _error;

  Map? get user => _user;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _loading = true; notifyListeners();
    try {
      _user = await _repo.login(email, password);
    } catch (e) { _error = e.toString(); }
    _loading = false; notifyListeners();
  }
}
`
    }

    files['lib/features/auth/ui/login_screen.dart'] = `import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Login')),
    body: const Center(child: Text('Login Screen — Feature First')),
  );
}
`
  }

  files['lib/features/home/home_module.dart'] = `export 'ui/home_screen.dart';
`
  files['lib/features/home/ui/home_screen.dart'] = `import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Home')),
    body: const Center(child: Text('Home Screen — Feature First')),
  );
}
`

  return files
}

// ── MVC (GetX) specific ──
function buildMvcFiles(feats) {
  const files = {}
  const hasAuth = feats.includes('auth')
  const hasApi = feats.includes('api')

  if (feats.includes('theme')) files['lib/app/theme.dart'] = genTheme()
  if (hasApi) files['lib/services/api_service.dart'] = `import 'package:dio/dio.dart';
import 'package:get/get.dart';

class ApiService extends GetxService {
  late Dio dio;

  Future<ApiService> init() async {
    dio = Dio(BaseOptions(
      baseUrl: 'https://api.example.com',
      connectTimeout: const Duration(seconds: 10),
    ));
    return this;
  }
}
`

  if (hasAuth) {
    files['lib/models/user.dart'] = `class User {
  final String id, email, name;
  final String? token;

  const User({required this.id, required this.email, required this.name, this.token});

  factory User.fromJson(Map<String, dynamic> j) => User(
    id: j['id'] as String,
    email: j['email'] as String,
    name: j['name'] as String,
    token: j['token'] as String?,
  );
}
`
    files['lib/controllers/auth_controller.dart'] = `import 'package:get/get.dart';
import '../models/user.dart';
${hasApi ? "import '../services/api_service.dart';" : ''}

class AuthController extends GetxController {
  final Rx<User?> user = Rx(null);
  final isLoading = false.obs;
  final errorMsg = ''.obs;

  bool get isAuthenticated => user.value != null;

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    errorMsg.value = '';
    try {
      // TODO: call ApiService
      await Future.delayed(const Duration(milliseconds: 500));
      user.value = User(id: '1', email: email, name: 'User', token: 'token_abc');
      Get.offAllNamed(AppRoutes.home);
    } catch (e) {
      errorMsg.value = e.toString();
      Get.snackbar('Login Failed', e.toString(), snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }

  void logout() {
    user.value = null;
    Get.offAllNamed(AppRoutes.login);
  }
}
`
    files['lib/bindings/auth_binding.dart'] = `import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AuthController>(() => AuthController());
  }
}
`
    files['lib/views/login_view.dart'] = `import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class LoginView extends GetView<AuthController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    final emailCtrl = TextEditingController();
    final passCtrl = TextEditingController();

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Welcome Back', style: Get.textTheme.headlineMedium),
              const SizedBox(height: 32),
              TextField(controller: emailCtrl, decoration: const InputDecoration(labelText: 'Email')),
              const SizedBox(height: 16),
              TextField(controller: passCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
              const SizedBox(height: 24),
              Obx(() => controller.isLoading.value
                ? const Center(child: CircularProgressIndicator())
                : FilledButton(
                    onPressed: () => controller.login(emailCtrl.text, passCtrl.text),
                    child: const Text('Login'),
                  ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  }

  files['lib/routes.dart'] = `import 'package:get/get.dart';
${hasAuth ? "import 'views/login_view.dart';\nimport 'bindings/auth_binding.dart';" : ''}
import 'package:flutter/material.dart';

class AppRoutes {
  static const home = '/';
  static const login = '/login';

  static final pages = [
    GetPage(
      name: home,
      page: () => const Scaffold(body: Center(child: Text('Home'))),
    ),
${hasAuth ? `    GetPage(
      name: login,
      page: () => const LoginView(),
      binding: AuthBinding(),
    ),` : ''}
  ];
}
`
  return files
}

// ── Clean Architecture specific ──
function buildCleanFiles(state, feats) {
  const files = {}
  const hasAuth = feats.includes('auth')
  const hasApi = feats.includes('api')

  // core
  files['lib/core/error/failures.dart'] = genFailures()
  files['lib/core/error/exceptions.dart'] = genExceptions()
  files['lib/core/usecase/usecase.dart'] = genUseCase()
  files['lib/core/constants/app_constants.dart'] = `class AppConstants {
  AppConstants._();
  static const String appName = 'My App';
  static const Duration connectionTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
`

  if (feats.includes('theme')) files['lib/core/theme/app_theme.dart'] = genTheme()
  if (feats.includes('router')) files['lib/core/router/app_router.dart'] = genRouter(feats, 'clean')
  if (feats.includes('env')) files['lib/core/constants/env.dart'] = genEnv()

  if (hasApi) {
    files['lib/core/network/dio_client.dart'] = genDioClient(feats)
    files['lib/core/network/auth_interceptor.dart'] = genAuthInterceptor()
  }

  if (hasAuth) {
    files['lib/features/auth/domain/entities/user.dart'] = genUserEntity()
    files['lib/features/auth/domain/repositories/auth_repository.dart'] = genAuthRepository()
    files['lib/features/auth/domain/usecases/login_usecase.dart'] = genLoginUseCase()
    files['lib/features/auth/data/models/user_model.dart'] = genUserModel()
    files['lib/features/auth/data/datasources/auth_remote_datasource.dart'] = genAuthRemoteDataSource(hasApi)
    files['lib/features/auth/data/repositories/auth_repository_impl.dart'] = genAuthRepositoryImpl(hasApi)
    files['lib/features/auth/presentation/pages/login_page.dart'] = genLoginPage(state)

    if (state === 'bloc') {
      const bloc = genAuthBloc()
      files['lib/features/auth/presentation/bloc/auth_cubit.dart'] = bloc['auth_cubit.dart']
      files['lib/features/auth/presentation/bloc/auth_state.dart'] = bloc['auth_state.dart']
    } else if (state === 'riverpod') {
      const rv = genAuthRiverpod()
      files['lib/features/auth/presentation/providers/auth_provider.dart'] = rv['auth_provider.dart']
    } else if (state === 'provider') {
      const pv = genAuthProvider()
      files['lib/features/auth/presentation/viewmodels/auth_viewmodel.dart'] = pv['auth_viewmodel.dart']
    } else if (state === 'getx') {
      const gx = genAuthGetX()
      files['lib/features/auth/presentation/controllers/auth_controller.dart'] = gx['auth_controller.dart']
    }
  }

  if (state !== 'getx' && state !== 'riverpod') {
    files['lib/injection_container.dart'] = genInjectionContainer(state, feats)
  }

  return files
}

function genSetupScript(projectName, orgName, type) {
  const snakeCaseName = projectName.replace(/-/g, '_').toLowerCase();
  
  if (type === 'sh') {
    return `#!/bin/bash
echo "Setting up ${projectName}..."
flutter create . --org "${orgName}" --project-name "${snakeCaseName}"
flutter pub get
# flutter run build_runner if there is code generation
echo "Setup complete. You can now run 'flutter run'."
`;
  } else {
    return `@echo off
echo Setting up ${projectName}...
flutter create . --org "${orgName}" --project-name "${snakeCaseName}"
flutter pub get
echo Setup complete. You can now run 'flutter run'.
pause
`;
  }
}

function genGithubActions() {
  return `name: Flutter CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
      with:
        channel: 'stable'
    
    - name: Install dependencies
      run: flutter pub get
    
    - name: Analyze project source
      run: flutter analyze
    
    - name: Run tests
      run: flutter test
`
}

// ════════════════════════════════════════════
// MAIN BUILDER
// ════════════════════════════════════════════
export function buildProject(projectName, orgName, arch, state, feats) {
  const hasRouter = feats.includes('router')

  // Base files always present
  const files = {
    'lib/main.dart': genMainDart(state, feats),
    'lib/app.dart': genAppDart(state, feats, hasRouter),
    'pubspec.yaml': generatePubspec(projectName, state, feats),
    'analysis_options.yaml': genAnalysisOptions(feats),
    'README.md': genReadme(projectName, arch, state, feats),
    'setup.sh': genSetupScript(projectName, orgName, 'sh'),
    'setup.bat': genSetupScript(projectName, orgName, 'bat'),
  }

  if (feats.includes('env')) {
    files['.env.example'] = genDotEnv()
    files['.gitignore'] = genGitignore()
  }

  if (feats.includes('cicd')) {
    files['.github/workflows/main.yml'] = genGithubActions()
  }

  // Architecture-specific files
  let archFiles = {}
  if (arch === 'clean')   archFiles = buildCleanFiles(state, feats)
  if (arch === 'mvvm')    archFiles = buildMvcFiles(feats) // reuse some, mvvm specific below
  if (arch === 'mvvm')    archFiles = { ...archFiles, ...buildMvvmFiles(state, feats) }
  if (arch === 'feature') archFiles = buildFeatureFiles(state, feats)
  if (arch === 'mvc')     archFiles = buildMvcFiles(feats)

  return { ...files, ...archFiles }
}
