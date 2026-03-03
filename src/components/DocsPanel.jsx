import { useState } from 'react'
import { ARCHITECTURES, STATE_MANAGERS } from '../data/constants.js'
import { getCompatibilityNote } from '../data/recommendations.js'
import { highlightDart } from '../utils/highlighter.js'
import styles from './DocsPanel.module.css'

function ArchDoc({ arch }) {
  return (
    <div className={styles.archDoc}>
      <div className={styles.archHeader}>
        <span className={styles.archIcon}>{arch.icon}</span>
        <div>
          <div className={styles.archName}>{arch.name}</div>
          <div className={styles.archDesc}>{arch.desc}</div>
        </div>
      </div>
      <p className={styles.archSummary}>{arch.summary}</p>
      <div className={styles.prosCons}>
        <div className={styles.pros}>
          <div className={styles.prosTitle}>✅ Pros</div>
          {arch.pros.map((p, i) => <div key={i} className={styles.proItem}>{p}</div>)}
        </div>
        <div className={styles.cons}>
          <div className={styles.consTitle}>⚠️ Cons</div>
          {arch.cons.map((c, i) => <div key={i} className={styles.conItem}>{c}</div>)}
        </div>
      </div>
    </div>
  )
}

function StateDoc({ sm }) {
  return (
    <div className={styles.stateDoc}>
      <div className={styles.stateHeader}>
        <span className={styles.stateIcon}>{sm.icon}</span>
        <div>
          <div className={styles.stateName} style={{ color: sm.color }}>{sm.name}</div>
          <div className={styles.stateDesc}>{sm.desc}</div>
        </div>
      </div>
      <p className={styles.stateSummary}>{sm.summary}</p>
      <div className={styles.prosCons}>
        <div className={styles.pros}>
          {sm.pros.map((p, i) => <div key={i} className={styles.proItem}>{p}</div>)}
        </div>
        <div className={styles.cons}>
          {sm.cons.map((c, i) => <div key={i} className={styles.conItem}>{c}</div>)}
        </div>
      </div>
    </div>
  )
}

function CompatibilityMatrix({ currentArch, currentState }) {
  return (
    <div className={styles.matrix}>
      <div className={styles.matrixTitle}>Compatibility Matrix</div>
      <div className={styles.matrixGrid}>
        <div className={styles.matrixCorner} />
        {STATE_MANAGERS.map(s => (
          <div key={s.id} className={`${styles.matrixColHeader} ${s.id === currentState ? styles.matrixHighlight : ''}`}>
            {s.icon} {s.name.split(' ')[0]}
          </div>
        ))}
        {ARCHITECTURES.map(a => (
          <>
            <div key={a.id + '-row'} className={`${styles.matrixRowHeader} ${a.id === currentArch ? styles.matrixHighlight : ''}`}>
              {a.icon} {a.name.split(' ')[0]}
            </div>
            {STATE_MANAGERS.map(s => {
              const note = getCompatibilityNote(a.id, s.id)
              const isGood = note.startsWith('✅')
              const isWarn = note.startsWith('⚠️')
              const isCurrent = a.id === currentArch && s.id === currentState
              return (
                <div
                  key={a.id + '-' + s.id}
                  className={`${styles.matrixCell} ${isGood ? styles.cellGood : isWarn ? styles.cellWarn : styles.cellBad} ${isCurrent ? styles.cellCurrent : ''}`}
                  title={note.replace(/^[✅⚠️❌]\s*/, '')}
                >
                  {isGood ? '✅' : isWarn ? '⚠️' : '❌'}
                  {isCurrent && <span className={styles.currentDot} />}
                </div>
              )
            })}
          </>
        ))}
      </div>
      <div className={styles.matrixNote}>
        {getCompatibilityNote(currentArch, currentState)}
      </div>
    </div>
  )
}

export default function DocsPanel({ arch, state }) {
  const [section, setSection] = useState('intro')

  const currentArch = ARCHITECTURES.find(a => a.id === arch)
  const currentState = STATE_MANAGERS.find(s => s.id === state)

  return (
    <div className={styles.panel}>
      <div className={styles.nav}>
        {[
          { id: 'intro', label: '📖 Introduction' },
          { id: 'arch', label: '🏛️ Architecture' },
          { id: 'state', label: '⚙️ State Mgmt' },
          { id: 'compat', label: '🔗 Compatibility' },
          { id: 'compare', label: '📊 Compare All' },
        ].map(s => (
          <button
            key={s.id}
            className={`${styles.navBtn} ${section === s.id ? styles.navBtnActive : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {section === 'intro' && (
          <div>
            <div className={styles.sectionTitle}>Introduction &amp; Usage Guide</div>
            <div className={styles.introText}>
              <p>Welcome to <b>Flutter Arch Studio</b>! This web tool is designed to accelerate your Flutter development by generating clean, production-ready boilerplate code instantly.</p>

              <h3 className={styles.introH3}>🚀 How to Use</h3>
              <ol className={styles.introList}>
                <li><b>Configure Project:</b> Use the left panel to set your project name and organization ID.</li>
                <li><b>Select Architecture:</b> Choose a design pattern that fits your team size and scaling needs (e.g. Clean Architecture, MVVM).</li>
                <li><b>Pick State Management:</b> Select your preferred reactive framework (BLoC, Riverpod, GetX, etc).</li>
                <li><b>Toggle Features:</b> Enable pre-configured modules like Authentication, Networking, or Local Storage.</li>
                <li><b>Preview &amp; Download:</b> Explore the generated file tree on the right. Once satisfied, click the Download button to get your <code>.zip</code> file.</li>
              </ol>

              <h3 className={styles.introH3}>💻 Post-Download Setup</h3>
              <div className={styles.setupBlock}>
                <code className={styles.setupCode}>
                  1. Extract the downloaded .zip file into an empty folder<br />
                  2. Open the folder in your terminal<br />
                  3. Run <b>sh setup.sh</b> or <b>setup.bat</b> (Windows)<br />
                  &nbsp;&nbsp;&nbsp;<i>(This generates platform folders like iOS/Android &amp; runs pub get)</i><br />
                  4. Run <b>flutter run</b>
                </code>
              </div>

              <p className={styles.introFooter}>
                Navigate to the other tabs in this documentation panel to learn more about the specific architectures and state management options you can choose from.
              </p>
            </div>
          </div>
        )}

        {section === 'arch' && currentArch && (
          <div>
            <div className={styles.sectionTitle}>Architecture Documentation</div>
            <ArchDoc arch={currentArch} />

            <div className={styles.layerDiagram}>
              <div className={styles.layerTitle}>Layer Diagram</div>
              {arch === 'clean' && (
                <div className={styles.layers}>
                  <div className={styles.layer} style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                    <span>🎨</span> <strong>Presentation</strong> — Bloc/Cubit, Pages, Widgets
                  </div>
                  <div className={styles.layerArrow}>↓ depends on</div>
                  <div className={styles.layer} style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.3)' }}>
                    <span>🏛️</span> <strong>Domain</strong> — Entities, Repositories (abstract), Use Cases
                  </div>
                  <div className={styles.layerArrow}>↓ depends on</div>
                  <div className={styles.layer} style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                    <span>🗄️</span> <strong>Data</strong> — Repository Impl, Data Sources, Models
                  </div>
                  <div className={styles.layerNote}>Dependency Rule: inner layers NEVER know outer layers</div>
                </div>
              )}
              {arch === 'mvvm' && (
                <div className={styles.layers}>
                  <div className={styles.layer} style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.3)' }}>
                    <span>🖥️</span> <strong>View</strong> — Widgets yang observe ViewModel
                  </div>
                  <div className={styles.layerArrow}>↕ data binding</div>
                  <div className={styles.layer} style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.3)' }}>
                    <span>🧠</span> <strong>ViewModel</strong> — State, logic, transform data
                  </div>
                  <div className={styles.layerArrow}>↓ calls</div>
                  <div className={styles.layer} style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                    <span>📦</span> <strong>Model</strong> — Data classes, Services, API
                  </div>
                </div>
              )}
              {arch === 'feature' && (
                <div className={styles.layers}>
                  <div className={styles.featureRow}>
                    {['auth', 'home', 'profile', '...'].map(f => (
                      <div key={f} className={styles.featureBox}>
                        <div className={styles.featureBoxTitle}>{f}</div>
                        <div className={styles.featureBoxItem}>data/</div>
                        <div className={styles.featureBoxItem}>logic/</div>
                        <div className={styles.featureBoxItem}>ui/</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.layerArrow}>shared code ↕</div>
                  <div className={styles.layer} style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
                    <span>🔗</span> <strong>shared/</strong> — widgets, utils, api_client, theme
                  </div>
                </div>
              )}
              {arch === 'mvc' && (
                <div className={styles.layers}>
                  <div className={styles.layer} style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                    <span>🖥️</span> <strong>View</strong> — GetView&lt;Controller&gt;, Obx() widgets
                  </div>
                  <div className={styles.layerArrow}>↕ GetX binding</div>
                  <div className={styles.layer} style={{ background: 'rgba(0,212,255,0.08)', borderColor: 'rgba(0,212,255,0.3)' }}>
                    <span>🎮</span> <strong>Controller</strong> — GetxController, .obs state
                  </div>
                  <div className={styles.layerArrow}>↓ uses</div>
                  <div className={styles.layer} style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                    <span>📊</span> <strong>Model</strong> — Data classes, Services
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {section === 'state' && currentState && (
          <div>
            <div className={styles.sectionTitle}>State Management Documentation</div>
            <StateDoc sm={currentState} />

            <div className={styles.codeExample}>
              <div className={styles.codeExHeader}>
                <span className={styles.codeExTitle}>Pattern Snapshot</span>
                <span className={styles.codeExLang}>dart</span>
              </div>
              {state === 'bloc' && (
                <pre
                  className={styles.codeEx}
                  dangerouslySetInnerHTML={{
                    __html: highlightDart(`// 1. Define state
abstract class AuthState {}
class AuthLoading extends AuthState {}
class AuthSuccess extends AuthState { final User user; ... }

// 2. Cubit (simplified BLoC)
class AuthCubit extends Cubit<AuthState> {
  Future<void> login(email, pass) async {
    emit(AuthLoading());           // emit state
    final result = await useCase(LoginParams(email, pass));
    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (user)    => emit(AuthSuccess(user)),
    );
  }
}

// 3. UI
BlocBuilder<AuthCubit, AuthState>(
  builder: (context, state) {
    if (state is AuthLoading) return CircularProgressIndicator();
    if (state is AuthSuccess) return HomeScreen();
    return LoginForm();
  },
)`)
                  }}
                />
              )}
              {state === 'riverpod' && (
                <pre
                  className={styles.codeEx}
                  dangerouslySetInnerHTML={{
                    __html: highlightDart(`// 1. Define notifier (with code gen)
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AsyncValue<User?> build() => const AsyncValue.data(null);

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(
      () => ref.read(authRepoProvider).login(email, password),
    );
  }
}

// 2. UI (ConsumerWidget)
class LoginPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    return authState.when(
      data: (user) => user != null ? HomeScreen() : LoginForm(),
      loading: () => CircularProgressIndicator(),
      error: (e, _) => Text(e.toString()),
    );
  }
}`)
                  }}
                />
              )}
              {state === 'provider' && (
                <pre
                  className={styles.codeEx}
                  dangerouslySetInnerHTML={{
                    __html: highlightDart(`// 1. ViewModel
class AuthViewModel extends ChangeNotifier {
  User? _user;
  bool _loading = false;

  User? get user => _user;
  bool get loading => _loading;

  Future<void> login(String email, String password) async {
    _loading = true;
    notifyListeners();         // trigger rebuild
    _user = await authService.login(email, password);
    _loading = false;
    notifyListeners();
  }
}

// 2. UI
Consumer<AuthViewModel>(
  builder: (context, vm, child) {
    if (vm.loading) return CircularProgressIndicator();
    return LoginForm(onSubmit: vm.login);
  },
)`)
                  }}
                />
              )}
              {state === 'getx' && (
                <pre
                  className={styles.codeEx}
                  dangerouslySetInnerHTML={{
                    __html: highlightDart(`// 1. Controller
class AuthController extends GetxController {
  final user = Rx<User?>(null);    // reactive
  final isLoading = false.obs;

  Future<void> login(String email, String password) async {
    isLoading.value = true;
    try {
      user.value = await authService.login(email, password);
      Get.offAllNamed('/home');    // navigate
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally { isLoading.value = false; }
  }
}

// 2. UI
class LoginView extends GetView<AuthController> {
  @override
  Widget build(context) => Obx(() =>   // auto-rebuild
    controller.isLoading.value
      ? CircularProgressIndicator()
      : LoginForm(onSubmit: controller.login),
  );
}`)
                  }}
                />
              )}
            </div>
          </div>
        )}

        {section === 'compat' && (
          <div>
            <div className={styles.sectionTitle}>Architecture × State Compatibility</div>
            <CompatibilityMatrix currentArch={arch} currentState={state} />
          </div>
        )}

        {section === 'compare' && (
          <div>
            <div className={styles.sectionTitle}>Architecture Comparison</div>
            <div className={styles.compareTable}>
              <div className={styles.compareHeader}>
                <div />
                {ARCHITECTURES.map(a => (
                  <div key={a.id} className={styles.compareColHead}>{a.icon} {a.name}</div>
                ))}
              </div>
              {[
                { label: 'Complexity', vals: ['High', 'Medium', 'Medium', 'Low'] },
                { label: 'Testability', vals: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐'] },
                { label: 'Boilerplate', vals: ['High', 'Medium', 'Medium', 'Low'] },
                { label: 'Team Size', vals: ['Any', 'Small-Med', 'Any', 'Solo-Small'] },
                { label: 'Best For', vals: ['Enterprise', 'SaaS/Apps', 'Large teams', 'Rapid MVP'] },
                { label: 'Learning Curve', vals: ['Steep', 'Moderate', 'Moderate', 'Easy'] },
              ].map(row => (
                <div key={row.label} className={styles.compareRow}>
                  <div className={styles.compareRowLabel}>{row.label}</div>
                  {row.vals.map((v, i) => (
                    <div key={i} className={`${styles.compareCell} ${ARCHITECTURES[i].id === arch ? styles.compareCellHighlight : ''}`}>
                      {v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
