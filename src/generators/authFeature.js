// ── Auth Feature File Generators ──

export function genUserEntity() {
  return `import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String name;
  final String? avatar;
  final String? token;

  const User({
    required this.id,
    required this.email,
    required this.name,
    this.avatar,
    this.token,
  });

  User copyWith({
    String? id, String? email, String? name,
    String? avatar, String? token,
  }) => User(
    id: id ?? this.id,
    email: email ?? this.email,
    name: name ?? this.name,
    avatar: avatar ?? this.avatar,
    token: token ?? this.token,
  );

  @override
  List<Object?> get props => [id, email, name, avatar, token];
}
`
}

export function genAuthRepository() {
  return `import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, User>> register({
    required String email,
    required String password,
    required String name,
  });
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, User?>> getCurrentUser();
}
`
}

export function genLoginUseCase() {
  return `import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase implements UseCase<User, LoginParams> {
  final AuthRepository repository;
  const LoginUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(LoginParams params) async {
    return repository.login(params.email, params.password);
  }
}

class LoginParams extends Equatable {
  final String email;
  final String password;

  const LoginParams({required this.email, required this.password});

  @override
  List<Object> get props => [email, password];
}
`
}

export function genUserModel() {
  return `import '../../domain/entities/user.dart';

class UserModel extends User {
  const UserModel({
    required super.id,
    required super.email,
    required super.name,
    super.avatar,
    super.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] as String,
    email: json['email'] as String,
    name: json['name'] as String,
    avatar: json['avatar'] as String?,
    token: json['token'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'name': name,
    if (avatar != null) 'avatar': avatar,
    if (token != null) 'token': token,
  };
}
`
}

export function genAuthRemoteDataSource(hasApi) {
  return `${hasApi ? "import 'package:dio/dio.dart';" : ''}
import '../../../../core/error/exceptions.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login(String email, String password);
  Future<UserModel> register({required String email, required String password, required String name});
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  ${hasApi ? 'final Dio dio;\n  const AuthRemoteDataSourceImpl(this.dio);' : '// TODO: inject Dio or HTTP client'}

  @override
  Future<UserModel> login(String email, String password) async {
    try {
      ${hasApi ? `final response = await dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      return UserModel.fromJson(response.data['data'] as Map<String, dynamic>);` : `// TODO: implement API call
      await Future.delayed(const Duration(milliseconds: 500));
      return UserModel(id: '1', email: email, name: 'User');`}
    } ${hasApi ? 'on DioException catch (e)' : 'catch (e)'} {
      throw ServerException(message: ${hasApi ? 'e.message ?? ' : ''}'Login failed');
    }
  }

  @override
  Future<UserModel> register({required String email, required String password, required String name}) async {
    try {
      ${hasApi ? `final response = await dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'name': name,
      });
      return UserModel.fromJson(response.data['data'] as Map<String, dynamic>);` : `await Future.delayed(const Duration(milliseconds: 500));
      return UserModel(id: '1', email: email, name: name);`}
    } ${hasApi ? 'on DioException catch (e)' : 'catch (e)'} {
      throw ServerException(message: ${hasApi ? 'e.message ?? ' : ''}'Register failed');
    }
  }

  @override
  Future<void> logout() async {
    ${hasApi ? `try {
      await dio.post('/auth/logout');
    } on DioException catch (e) {
      throw ServerException(message: e.message ?? 'Logout failed');
    }` : '// TODO: clear local storage'}
  }
}
`
}

export function genAuthRepositoryImpl(hasApi) {
  return `import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  const AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    try {
      final user = await remoteDataSource.login(email, password);
      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> register({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final user = await remoteDataSource.register(
        email: email, password: password, name: name,
      );
      return Right(user);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await remoteDataSource.logout();
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, User?>> getCurrentUser() async {
    // TODO: get from local storage / secure storage
    return const Right(null);
  }
}
`
}

// ── Presentation layer per state management ──

export function genAuthBloc() {
  return {
    'auth_cubit.dart': `import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';

part 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  final LoginUseCase loginUseCase;

  AuthCubit({required this.loginUseCase}) : super(const AuthInitial());

  Future<void> login(String email, String password) async {
    emit(const AuthLoading());
    final result = await loginUseCase(LoginParams(email: email, password: password));
    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  void logout() => emit(const AuthUnauthenticated());
}
`,
    'auth_state.dart': `part of 'auth_cubit.dart';

abstract class AuthState {
  const AuthState();
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  final User user;
  const AuthAuthenticated(this.user);
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
}
`,
  }
}

export function genAuthRiverpod() {
  return {
    'auth_provider.dart': `import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';
// import '../../../../injection_container.dart'; // uncomment to use GetIt

part 'auth_provider.g.dart';

@riverpod
class AuthNotifier extends _\$AuthNotifier {
  @override
  AsyncValue<User?> build() => const AsyncValue.data(null);

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    // final loginUseCase = ref.read(loginUseCaseProvider);
    state = await AsyncValue.guard(() async {
      // final result = await loginUseCase(LoginParams(email: email, password: password));
      // return result.fold((f) => throw Exception(f.message), (u) => u);
      throw UnimplementedError('Wire up LoginUseCase via ref or GetIt');
    });
  }

  void logout() => state = const AsyncValue.data(null);
}
`,
  }
}

export function genAuthProvider() {
  return {
    'auth_viewmodel.dart': `import 'package:flutter/foundation.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';

class AuthViewModel extends ChangeNotifier {
  final LoginUseCase loginUseCase;

  AuthViewModel({required this.loginUseCase});

  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await loginUseCase(
      LoginParams(email: email, password: password),
    );

    result.fold(
      (failure) => _error = failure.message,
      (user) => _user = user,
    );

    _isLoading = false;
    notifyListeners();
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}
`,
  }
}

export function genAuthGetX() {
  return {
    'auth_controller.dart': `import 'package:get/get.dart';
import '../../domain/entities/user.dart';
import '../../domain/usecases/login_usecase.dart';

class AuthController extends GetxController {
  final LoginUseCase loginUseCase;

  AuthController({required this.loginUseCase});

  final Rx<User?> user = Rx(null);
  final isLoading = false.obs;
  final errorMessage = ''.obs;

  bool get isAuthenticated => user.value != null;

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    errorMessage.value = '';

    final result = await loginUseCase(
      LoginParams(email: email, password: password),
    );

    result.fold(
      (failure) {
        errorMessage.value = failure.message;
        Get.snackbar(
          'Login Failed',
          failure.message,
          snackPosition: SnackPosition.BOTTOM,
        );
      },
      (u) {
        user.value = u;
        Get.offAllNamed('/home');
      },
    );

    isLoading.value = false;
  }

  void logout() {
    user.value = null;
    Get.offAllNamed('/login');
  }
}
`,
  }
}

export function genLoginPage(state) {
  const stateImports = {
    bloc: `import 'package:flutter_bloc/flutter_bloc.dart';\nimport '../bloc/auth_cubit.dart';`,
    riverpod: `import 'package:flutter_riverpod/flutter_riverpod.dart';\nimport '../providers/auth_provider.dart';`,
    provider: `import 'package:provider/provider.dart';\nimport '../viewmodels/auth_viewmodel.dart';`,
    getx: `import 'package:get/get.dart';\nimport '../controllers/auth_controller.dart';`,
  }

  const loginCall = {
    bloc: `context.read<AuthCubit>().login(email, password);`,
    riverpod: `// ref.read(authNotifierProvider.notifier).login(email, password);`,
    provider: `context.read<AuthViewModel>().login(email, password);`,
    getx: `Get.find<AuthController>().login(email, password);`,
  }

  return `import 'package:flutter/material.dart';
${stateImports[state]}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscurePass = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  void _login() {
    if (!_formKey.currentState!.validate()) return;
    final email = _emailCtrl.text.trim();
    final password = _passCtrl.text;
    ${loginCall[state]}
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Welcome Back',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to continue',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.outline,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 40),
                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Email is required';
                      if (!v.contains('@')) return 'Enter a valid email';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passCtrl,
                    obscureText: _obscurePass,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: const Icon(Icons.lock_outlined),
                      suffixIcon: IconButton(
                        icon: Icon(_obscurePass ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                        onPressed: () => setState(() => _obscurePass = !_obscurePass),
                      ),
                    ),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Password is required';
                      if (v.length < 6) return 'Minimum 6 characters';
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  FilledButton(
                    onPressed: _login,
                    child: const Padding(
                      padding: EdgeInsets.symmetric(vertical: 4),
                      child: Text('Login', style: TextStyle(fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`
}
