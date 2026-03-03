export function genAiContext(projectName, arch, state, feats) {
  const isStrict = feats.includes('lints')
  const hasAuth = feats.includes('auth')
  const hasApi = feats.includes('api')

  const archDescriptions = {
    clean: `Clean Architecture (Domain-Driven, 3 Layers):
- **core/**: Essential utilities, networking clients, error handling (Failures/Exceptions), and routing.
- **features/**: Divided into independent modules (e.g., auth, home).
  - **domain/**: Contains Entities (pure Dart objects), abstract Repositories, and UseCases. This layer MUST NOT have any dependencies on Flutter UI or outer layers (data/presentation).
  - **data/**: Contains Models (JSON serialization), DataSources (local/remote fetchers), and RepositoryImpl (implements abstract Repositories from domain).
  - **presentation/**: Contains Pages/Screens, Widgets, and State Management (Bloc/Cubit). Controls the UI and reacts to states.

**Rule**: Dependencies point INWARD. Presentation -> Domain <- Data.`,
    mvvm: `Model-View-ViewModel (MVVM):
- **models/**: Data structures and entity definitions.
- **services/**: API, local storage, and other external integrations.
- **viewmodels/**: Handles the business logic and state. Exposes reactive properties for the UI to listen to. Never contains UI code (no importing dart:ui or flutter/material).
- **views/**: The UI layers. Only observe/listen to ViewModels and trigger actions. Never hold business logic.`,
    feature: `Feature-First Architecture:
Grouped entirely by feature rather than by layer type.
- **shared/**: For code used across multiple features (widgets, api clients, theme, utils).
- **features/**: Each feature folder (e.g., auth, profile) is a self-contained module containing its own \`data/\`, \`logic/\` (state management), and \`ui/\` components.`,
    mvc: `Model-View-Controller (GetX Pattern):
- **models/**: Plain Dart data classes.
- **services/**: Global/App-wide services (like ApiService). Usually extend GetxService.
- **controllers/**: GetxControllers that manage state and logic. Use \`.obs\` for reactive variables.
- **views/**: UI screens. Wrap reactive parts with \`Obx(() => ...)\` or use \`GetView<Controller>\`.
- **bindings/**: For dependency injection per route using Get.lazyPut().`
  }

  const stateDescriptions = {
    bloc: `BLoC / Cubit Pattern:
- Prefer \`Cubit\` for simpler states and \`Bloc\` only when advance event-transformations (debounce, switchMap) are needed.
- States should be immutable. Use \`freezed\` or \`equatable\` for state classes.
- Handle loading, success, and error states explicitly. Provide a unified ` + '`Failure`' + ` wrapper for errors.`,
    riverpod: `Riverpod Pattern:
- Use Riverpod Generator (\`@riverpod\`) for almost all providers instead of manual providers.
- Use \`AsyncValue\` for managing asynchronous requests (loading, data, error).
- UI should observe state via \`ConsumerWidget\` or \`ConsumerStatefulWidget\`.`,
    provider: `Provider Pattern:
- Extend \`ChangeNotifier\` for view models.
- Call \`notifyListeners()\` ONLY when necessary to minimize rebuilds.
- Use \`Consumer<T>\` or \`context.watch<T>()\` wisely to rebuild only specific parts of the widget tree.`,
    getx: `GetX Pattern:
- Keep controllers focused. Avoid humongous "god controllers".
- Use \`.obs\` correctly and avoid redundant calls to \`update()\`.
- Only wrap widgets that actually depend on reactive variables with \`Obx()\`.`
  }

  return `## AI System Context & Rules
You are an expert Flutter Developer AI assistant working on the "${projectName}" project.
Please adhere strictly to the rules and conventions defined below to ensure the codebase remains clean, maintainable, and uniform.

### 1. Selected Stack & Roles
- **Architecture Type**: ${arch.toUpperCase()}
- **State Management**: ${state.toUpperCase()}
- **Key Enabled Features**: ${feats.join(', ')}

### 2. Architecture Guidelines
${archDescriptions[arch] || 'Follow standard structural conventions for ' + arch}

### 3. State Management Rules
${stateDescriptions[state] || 'Follow best practices for ' + state}

### 4. General Coding Guidelines
- **Null Safety**: Enforce strict null-safety. Avoid using the \`!\` (bang) operator unless absolutely certain. Prefer \`?\` and null-aware operators.
- **Widget Const**: Wherever possible, add the \`const\` keyword to widgets to optimize rebuilds.
- **Clean Code**: Follow DRY (Don't Repeat Yourself) and SOLID principles. Keep functions small and meaningful.
- **Comments & Documentation**: Add dartdoc comments (\`///\`) for public APIs, classes, and complex logic blocks.
${isStrict ? '- **Lints**: This project uses strict linting rules. Ensure all generated code passes `flutter analyze` without warnings (e.g., proper trailing commas, sort child properties last).' : ''}
${hasApi ? '- **Networking**: Network calls are handled via Dio. Ensure all requests are wrapped in try-catch blocks and parsed into standardized `Failure` or `Exception` formats.' : ''}
${hasAuth ? '- **Authentication**: Auth state overrides global routing. Ensure tokens are handled properly and unauthorized calls prompt a logout.' : ''}

### 5. AI Assistant Behaviors
- Read the project structure before generating file paths to match the existing convention.
- If asked to create a new "Feature" or "Entity", strictly follow the ${arch.toUpperCase()} boilerplate structure found in the current codebase.
- Do NOT hallucinate dependencies. If a package is not in \`pubspec.yaml\`, either ask the user for permission to add it or explicitly mention that it requires installation.
- Provide full, copy-pasteable files ONLY when making significant changes. For minor edits, just show the exact block to be modified.
`
}
