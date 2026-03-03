// Smart recommendation engine
// Suggests arch + state + features based on project type

export const PROJECT_TYPES = [
  {
    id: 'startup',
    icon: '🚀',
    label: 'MVP / Startup',
    desc: 'Ship fast, iterate quickly',
    recommend: { arch: 'mvvm', state: 'riverpod', feats: ['auth', 'api', 'router', 'theme', 'env'] },
    reason: 'MVVM + Riverpod adalah sweet spot antara simplicity dan scalability. Cukup structured untuk grow, tapi tidak over-engineered untuk MVP.',
  },
  {
    id: 'enterprise',
    icon: '🏢',
    label: 'Enterprise / Tim Besar',
    desc: 'Strict, scalable, testable',
    recommend: { arch: 'clean', state: 'bloc', feats: ['auth', 'api', 'router', 'theme', 'env', 'storage'] },
    reason: 'Clean Architecture + BLoC adalah standard industry untuk enterprise. Strict separation bikin onboarding developer baru lebih mudah.',
  },
  {
    id: 'solo',
    icon: '👤',
    label: 'Solo Project / Indie',
    desc: 'Simple, minimal boilerplate',
    recommend: { arch: 'mvc', state: 'getx', feats: ['auth', 'api', 'theme'] },
    reason: 'GetX + MVC setup paling cepat. Untuk solo developer yang mau fokus ke feature, bukan setup boilerplate.',
  },
  {
    id: 'team-medium',
    icon: '👥',
    label: 'Tim Kecil (2-5 orang)',
    desc: 'Balance antara simplicity & structure',
    recommend: { arch: 'feature', state: 'riverpod', feats: ['auth', 'api', 'router', 'theme', 'env'] },
    reason: 'Feature-first + Riverpod perfect untuk tim kecil. Setiap developer bisa own satu feature tanpa conflict.',
  },
  {
    id: 'learning',
    icon: '📚',
    label: 'Belajar Flutter',
    desc: 'Understand the fundamentals',
    recommend: { arch: 'mvvm', state: 'provider', feats: ['auth', 'api', 'theme'] },
    reason: 'Provider adalah state management paling mudah dipahami. MVVM structure yang clear bikin learning curve lebih gentle.',
  },
  {
    id: 'ecommerce',
    icon: '🛍️',
    label: 'E-Commerce / Marketplace',
    desc: 'Complex state, many features',
    recommend: { arch: 'clean', state: 'bloc', feats: ['auth', 'api', 'router', 'theme', 'env', 'storage', 'push', 'firebase'] },
    reason: 'E-commerce butuh state management yang solid untuk cart, order, payment flow. Clean Arch memastikan setiap domain terpisah dengan jelas.',
  },
]

// Compatibility scores between arch + state
export const COMPATIBILITY = {
  clean: { bloc: 10, riverpod: 9, provider: 7, getx: 5 },
  mvvm:  { bloc: 7,  riverpod: 10, provider: 9, getx: 6 },
  feature: { bloc: 8, riverpod: 10, provider: 7, getx: 6 },
  mvc:   { bloc: 4,  riverpod: 5, provider: 5, getx: 10 },
}

export function getCompatibilityNote(arch, state) {
  const score = COMPATIBILITY[arch]?.[state] ?? 5

  const notes = {
    'clean-bloc': '✅ Kombinasi paling populer di production apps. Strict & testable.',
    'clean-riverpod': '✅ Modern & powerful. Code gen required tapi hasilnya clean.',
    'clean-provider': '⚠️ Bisa jalan tapi kurang optimal. ChangeNotifier lebih cocok di MVVM.',
    'clean-getx': '⚠️ GetX terlalu opinionated untuk Clean Arch. DI conflict.',
    'mvvm-riverpod': '✅ Sweet spot. Riverpod NotifierProvider = perfect ViewModel.',
    'mvvm-provider': '✅ Klasik & proven. ChangeNotifier = ViewModel yang natural.',
    'mvvm-bloc': '✅ Solid. Cubit lebih cocok daripada full BLoC untuk MVVM.',
    'mvvm-getx': '⚠️ GetX bisa override MVVM structure. Hati-hati jadi MVC.',
    'feature-riverpod': '✅ Recommended. Riverpod providers natural per-feature scope.',
    'feature-bloc': '✅ BLoC per-feature sangat clean dan testable.',
    'feature-provider': '⚠️ Bisa, tapi provider scope antar feature perlu careful.',
    'feature-getx': '⚠️ GetX global state bisa bocor antar feature.',
    'mvc-getx': '✅ Native combo. GetX = state + routing + DI sekaligus.',
    'mvc-bloc': '⚠️ Overkill untuk MVC. GetX Controller lebih natural.',
    'mvc-riverpod': '⚠️ Unusual combination. Riverpod lebih cocok untuk layered arch.',
    'mvc-provider': '⚠️ Bisa jalan tapi GetX lebih natural untuk MVC pattern.',
  }

  return notes[`${arch}-${state}`] || (score >= 8 ? '✅ Good combination.' : score >= 6 ? '⚠️ Works but not optimal.' : '❌ Not recommended.')
}
