// Descriptions shown in file info panel when a file is selected
export const FILE_DESCRIPTIONS = {
  'lib/main.dart': {
    role: 'Entry Point',
    desc: 'Titik masuk aplikasi Flutter. Di sini kamu initialize semua dependencies (Firebase, Hive, DI) sebelum runApp() dipanggil.',
    tips: ['Jangan taruh business logic di sini', 'Pastikan WidgetsFlutterBinding.ensureInitialized() dipanggil pertama', 'Async main() diperlukan kalau ada initialization async'],
  },
  'lib/app.dart': {
    role: 'Root Widget',
    desc: 'Widget root aplikasi. Berisi MaterialApp/GetMaterialApp beserta theme, router, dan locale configuration.',
    tips: ['Pisahkan dari main.dart biar lebih testable', 'Semua app-level config ada di sini'],
  },
  'pubspec.yaml': {
    role: 'Project Config',
    desc: 'File konfigurasi Flutter project. Berisi metadata project, dependencies, dan asset configuration.',
    tips: ['Selalu run flutter pub get setelah edit file ini', 'Gunakan version constraint yang proper (^1.0.0)', 'Jangan commit .dart_tool/ ke git'],
  },
  'analysis_options.yaml': {
    role: 'Lint Config',
    desc: 'Konfigurasi Dart analyzer dan linter rules. Menentukan code style yang harus diikuti seluruh tim.',
    tips: ['Semakin strict rule-nya, semakin consistent codebase lo', 'Exclude generated files (*.g.dart)'],
  },
  'lib/injection_container.dart': {
    role: 'Dependency Injection',
    desc: 'Setup GetIt service locator. Semua dependencies (repositories, use cases, services) didaftarkan di sini.',
    tips: ['registerLazySingleton → instantiate saat pertama dipakai', 'registerFactory → buat instance baru tiap kali dipanggil', 'Panggil configureDependencies() di main.dart sebelum runApp()'],
  },
  'lib/core/error/failures.dart': {
    role: 'Error Types',
    desc: 'Sealed class hierarchy untuk domain-level errors. Digunakan sebagai Left value dalam Either<Failure, T>.',
    tips: ['Pisahkan Failure (domain) dari Exception (data layer)', 'Setiap tipe error punya class sendiri untuk exhaustive handling'],
  },
  'lib/core/error/exceptions.dart': {
    role: 'Exceptions',
    desc: 'Custom exception classes untuk data layer. Dilempar oleh data sources dan di-catch di repository implementations.',
    tips: ['Exception hanya ada di data layer', 'Repository impl catch Exception → return Left(Failure)'],
  },
  'lib/core/usecase/usecase.dart': {
    role: 'UseCase Base',
    desc: 'Abstract base class untuk semua use cases. Memastikan setiap use case punya single responsibility dan interface yang konsisten.',
    tips: ['Satu use case = satu action bisnis', 'UseCase hanya boleh tahu domain layer', 'Gunakan NoParams kalau tidak butuh parameter'],
  },
  'lib/core/network/dio_client.dart': {
    role: 'HTTP Client',
    desc: 'Singleton Dio instance dengan base configuration. Interceptor untuk auth token, logging, dan error handling sudah terpasang.',
    tips: ['Jangan buat Dio instance baru di tiap repository', 'AuthInterceptor otomatis attach Bearer token', 'LogInterceptor matikan di production'],
  },
  'lib/core/network/auth_interceptor.dart': {
    role: 'Auth Interceptor',
    desc: 'Dio interceptor yang otomatis menambahkan Authorization header ke setiap request, dan handle 401 Unauthorized.',
    tips: ['Implement token refresh logic di onError handler', 'Simpan token di secure storage (flutter_secure_storage)'],
  },
  'lib/core/router/app_router.dart': {
    role: 'Navigation',
    desc: 'GoRouter configuration. Mendefinisikan semua named routes, redirect logic, dan nested navigation.',
    tips: ['Gunakan named routes biar mudah di-navigate dari mana saja', 'Tambahkan redirect: untuk auth guard', 'Gunakan ShellRoute untuk nested navigation dengan bottom nav'],
  },
  'lib/core/theme/app_theme.dart': {
    role: 'Theming',
    desc: 'Light dan dark theme definition menggunakan Material 3. ColorScheme di-generate dari seed color.',
    tips: ['Gunakan Theme.of(context) untuk akses warna di widget', 'colorScheme.primary, .secondary, .surface adalah yang paling sering dipakai', 'useMaterial3: true untuk M3 components'],
  },
  'lib/core/constants/env.dart': {
    role: 'Environment Config',
    desc: 'Centralized access ke environment variables dari file .env. Jangan hardcode API keys di source code.',
    tips: ['.env TIDAK boleh di-commit ke git', 'Gunakan .env.example sebagai template untuk tim', 'Set fallback value yang aman untuk development'],
  },
}

// Per-pattern descriptions
export function getFileDescription(filePath) {
  // Exact match first
  if (FILE_DESCRIPTIONS[filePath]) return FILE_DESCRIPTIONS[filePath]

  // Pattern matching
  if (filePath.includes('/domain/entities/')) {
    return { role: 'Entity', desc: 'Pure Dart class yang merepresentasikan business object. Tidak ada dependency ke package eksternal maupun framework.', tips: ['Extend Equatable untuk value comparison', 'Hanya berisi field dan copyWith()', 'Tidak boleh ada logic API atau database di sini'] }
  }
  if (filePath.includes('/domain/repositories/')) {
    return { role: 'Repository Interface', desc: 'Abstract class yang mendefinisikan contract untuk data operations. Domain layer hanya tahu interface ini, bukan implementasinya.', tips: ['Return Either<Failure, T> untuk error handling functional', 'Method name harus describe intent bisnis, bukan teknis'] }
  }
  if (filePath.includes('/domain/usecases/')) {
    return { role: 'Use Case', desc: 'Satu class, satu business action. Orchestrate repository calls dan business rules tanpa tahu detail implementasi.', tips: ['Testable tanpa mocking framework/package', 'Jika terlalu complex, mungkin perlu dipecah'] }
  }
  if (filePath.includes('/data/models/')) {
    return { role: 'Data Model', desc: 'Extends entity dengan tambahan serialization (fromJson/toJson). Tahu format data dari API/database.', tips: ['Gunakan json_serializable untuk generate fromJson/toJson', 'Model adalah DTO (Data Transfer Object)'] }
  }
  if (filePath.includes('/data/datasources/')) {
    return { role: 'Data Source', desc: 'Langsung berinteraksi dengan API, database, atau cache. Lempar Exception (bukan Failure) jika ada error.', tips: ['Remote datasource → API calls', 'Local datasource → Hive/SharedPrefs', 'Repository impl yang decide mana yang dipakai'] }
  }
  if (filePath.includes('/data/repositories/')) {
    return { role: 'Repository Impl', desc: 'Implementasi dari repository interface. Catch exceptions dari datasource dan convert ke Failure.', tips: ['try-catch di sini, return Either', 'Bisa combine remote + local datasource (offline-first)'] }
  }
  if (filePath.includes('/presentation/bloc/') || filePath.includes('/presentation/cubit/')) {
    return { role: 'BLoC / Cubit', desc: 'State management layer. Receive events/method calls, call use cases, emit new states.', tips: ['Cubit: emit() langsung', 'BLoC: handle Events via on<Event>()', 'Inject use cases melalui constructor'] }
  }
  if (filePath.includes('/presentation/providers/')) {
    return { role: 'Riverpod Provider', desc: 'State management dengan Riverpod. @riverpod annotation + build_runner untuk generate boilerplate.', tips: ['ref.watch() di build method untuk rebuild', 'ref.read() di callbacks/functions', 'AsyncValue.guard() untuk async operations'] }
  }
  if (filePath.includes('/presentation/viewmodels/')) {
    return { role: 'ViewModel', desc: 'ChangeNotifier yang hold state dan expose methods ke View. Notify listeners saat state berubah.', tips: ['notifyListeners() setelah state change', 'Jangan taruh UI logic di ViewModel', 'Test dengan unit test tanpa Flutter'] }
  }
  if (filePath.includes('/presentation/controllers/')) {
    return { role: 'GetX Controller', desc: 'GetxController dengan reactive state (.obs variables). Obx() widget rebuild otomatis saat .obs berubah.', tips: ['isLoading.value = true/false untuk loading state', 'Get.snackbar() untuk user feedback', 'onInit() untuk initialization logic'] }
  }
  if (filePath.includes('/presentation/pages/') || filePath.includes('/presentation/screens/') || filePath.includes('/ui/')) {
    return { role: 'Screen / Page', desc: 'UI layer. Hanya bertanggung jawab untuk render state dan forward user actions ke state management.', tips: ['Jangan taruh business logic di widget', 'Pisahkan ke komponen kecil untuk readability', 'Gunakan const constructor sebanyak mungkin'] }
  }
  if (filePath.includes('binding')) {
    return { role: 'GetX Binding', desc: 'Lazy dependency injection untuk GetX. Controllers di-register dan di-dispose otomatis saat route berubah.', tips: ['Satu binding per route/feature', 'Get.lazyPut() → instantiate saat pertama dipanggil', 'Bind ke GetPage di routes.dart'] }
  }
  if (filePath.endsWith('routes.dart') || filePath.endsWith('app_router.dart')) {
    return { role: 'Routes', desc: 'Definisi semua navigation routes dalam satu tempat.', tips: ['Gunakan constants untuk route names', 'Hindari hardcode string route di banyak tempat'] }
  }

  return { role: 'Source File', desc: 'File source code Flutter/Dart.', tips: [] }
}
