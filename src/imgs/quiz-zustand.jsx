import { useState, useCallback, useReducer } from "react";

// ============================================================
// TIPOS (TypeScript simulado con JSDoc para la exposición)
// ============================================================
// type Question = { id: number; question: string; options: string[]; correct: number; }
// type QuizState = { questions: Question[]; current: number; answers: number[]; score: number; status: 'idle'|'playing'|'finished'; }
// type QuizActions = { start, answer, next, reset }

// ============================================================
// ZUSTAND STORE (simulado con useReducer para renderizar aquí)
// En un proyecto real: import { create } from 'zustand'
// ============================================================
const questions = [
  { id: 1, question: "¿Qué es Zustand?", options: ["Una base de datos", "Una librería de estado global para React", "Un framework CSS", "Un bundler de JS"], correct: 1 },
  { id: 2, question: "¿Qué hook de Zustand usamos para leer el estado?", options: ["useContext", "useGlobal", "useStore (el hook creado con create())", "useReducer"], correct: 2 },
  { id: 3, question: "¿Cuál es la diferencia principal entre Zustand y useContext?", options: ["No hay diferencia", "Zustand no re-renderiza componentes que no usan el dato cambiado", "useContext es más rápido siempre", "Zustand solo funciona con TypeScript"], correct: 1 },
  { id: 4, question: "En TypeScript, ¿cómo tipamos el store de Zustand?", options: ["Con PropTypes", "Con una interface o type que define estado y acciones", "No se puede tipar", "Con enum"], correct: 1 },
  { id: 5, question: "¿Qué método de Zustand permite modificar el estado?", options: ["setState()", "dispatch()", "set() — recibido en el callback de create()", "mutate()"], correct: 2 },
  { id: 6, question: "¿Qué vimos en el tema de useReducer (#6) que se parece a Zustand?", options: ["Nada, son completamente distintos", "La idea de acciones que modifican el estado de forma predecible", "Los hooks de ciclo de vida", "El sistema de rutas"], correct: 1 },
  { id: 7, question: "¿Zustand necesita un Provider como useContext (#6)?", options: ["Sí, siempre", "No, el store es global sin Provider", "Solo en TypeScript", "Depende de la versión"], correct: 1 },
];

// ---- Reducer que simula el store de Zustand ----
function quizReducer(state, action) {
  switch (action.type) {
    case "START": return { ...state, status: "playing", current: 0, answers: [], score: 0 };
    case "ANSWER": {
      const isCorrect = action.payload === questions[state.current].correct;
      return {
        ...state,
        answers: [...state.answers, action.payload],
        score: isCorrect ? state.score + 1 : state.score,
        status: state.current === questions.length - 1 ? "finished" : "playing",
        current: state.current < questions.length - 1 ? state.current + 1 : state.current,
      };
    }
    case "RESET": return initialState;
    default: return state;
  }
}
const initialState = { status: "idle", current: 0, answers: [], score: 0 };

// ============================================================
// COMPONENTES
// ============================================================

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);
  return (
    <div style={{ margin: "10px 0" }}>
      {label && <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 4, fontFamily: "monospace" }}>{label}</div>}
      <div style={{ position: "relative" }}>
        <pre style={{ background: "#0d1117", color: "#c9d1d9", padding: "14px 16px", borderRadius: 8, fontSize: 12, overflowX: "auto", margin: 0, lineHeight: 1.6, border: "1px solid #30363d" }}>
          <code>{code}</code>
        </pre>
        <button onClick={handleCopy} style={{ position: "absolute", top: 8, right: 8, background: copied ? "#238636" : "#21262d", color: "#c9d1d9", border: "1px solid #30363d", borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>
          {copied ? "✓" : "copiar"}
        </button>
      </div>
    </div>
  );
}

const TABS = ["📋 Concepto", "🏗️ Store", "⚡ Acciones", "🔗 Conexión", "🎮 Quiz"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = useCallback((idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setTimeout(() => {
      dispatch({ type: "ANSWER", payload: idx });
      setSelected(null);
      setShowAnswer(false);
    }, 900);
  }, [showAnswer]);

  const q = questions[state.current];
  const pct = Math.round((state.score / questions.length) * 100);

  const accent = "#7c3aed";
  const accentLight = "#a78bfa";
  const bg = "#0f0f1a";
  const card = "#1a1a2e";
  const cardBorder = "#2d2d4e";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: "20px 24px", borderBottom: `1px solid ${cardBorder}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🐻</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>JavaScript Quiz</h1>
              <p style={{ margin: 0, fontSize: 13, color: accentLight }}>Tema #13 — Zustand + TypeScript · Curso de React.js</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: card, borderBottom: `1px solid ${cardBorder}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "12px 18px", background: "none", border: "none", cursor: "pointer",
              color: tab === i ? accentLight : "#94a3b8", fontSize: 13, fontWeight: tab === i ? 700 : 400,
              borderBottom: tab === i ? `2px solid ${accentLight}` : "2px solid transparent",
              whiteSpace: "nowrap", transition: "all .2s"
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>

        {/* TAB 0 — Concepto */}
        {tab === 0 && (
          <div>
            <Section title="¿Qué es Zustand?" accent={accent}>
              <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>
                <b style={{ color: accentLight }}>Zustand</b> es una librería de manejo de <b>estado global</b> para React.
                Es minimalista, rápida y no requiere Provider. Fue creada como alternativa más simple a Redux (#10) y más performante que useContext (#6).
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                {[
                  { icon: "⚡", title: "Sin Provider", desc: "El store es accesible desde cualquier componente sin envolver la app" },
                  { icon: "🎯", title: "Re-renders precisos", desc: "Solo re-renderiza los componentes que usan el dato que cambió" },
                  { icon: "🔒", title: "TypeScript nativo", desc: "Tipado completo del store con interfaces, igual que en Redux Toolkit (#10)" },
                  { icon: "🪶", title: "Muy liviano", desc: "~1kb. Mucho más pequeño que Redux sin perder funcionalidad" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "#16213e", border: `1px solid ${cardBorder}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
                    <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 13 }}>{c.title}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Relación con temas anteriores" accent={accent}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { tema: "#6 — useContext y useReducer", rel: "Zustand resuelve el mismo problema (estado global) pero sin boilerplate ni Provider" },
                  { tema: "#10 — Redux Toolkit", rel: "Zustand es más simple: sin slices, sin createAction, lógica en un solo objeto" },
                  { tema: "#8 — TypeScript", rel: "El store se tipa con una interface que define tanto el estado como las acciones" },
                  { tema: "#4 — Custom Hooks", rel: "useStore() de Zustand ES un custom hook. Sigue exactamente el mismo patrón" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#16213e", border: `1px solid ${cardBorder}`, borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ color: accentLight, fontWeight: 700, fontSize: 12, minWidth: 160 }}>{r.tema}</span>
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>→ {r.rel}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Zustand vs Redux vs useContext" accent={accent}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#16213e" }}>
                      {["Característica", "useContext", "Redux Toolkit", "Zustand"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: accentLight, border: `1px solid ${cardBorder}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Provider", "✅ Necesario", "✅ Necesario", "❌ No necesita"],
                      ["Re-renders", "⚠️ Todos los hijos", "✅ Selectivos", "✅ Selectivos"],
                      ["Boilerplate", "🟡 Medio", "🔴 Alto", "🟢 Mínimo"],
                      ["DevTools", "❌ No", "✅ Redux DevTools", "✅ Zustand DevTools"],
                      ["TypeScript", "✅", "✅✅", "✅✅"],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#16213e08" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "8px 12px", border: `1px solid ${cardBorder}`, color: "#94a3b8" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        )}

        {/* TAB 1 — Store */}
        {tab === 1 && (
          <div>
            <Section title="Instalación" accent={accent}>
              <CodeBlock label="terminal" code={`npm install zustand`} />
              <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>
                Nada más. No necesitas configurar un Provider ni un store central como Redux.
              </p>
            </Section>

            <Section title="Crear el Store con TypeScript" accent={accent}>
              <CodeBlock label="src/store/useQuizStore.ts" code={`import { create } from 'zustand'

// 1. Definimos los tipos (TypeScript)
interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

// 2. Tipamos el estado + las acciones juntos
interface QuizStore {
  // Estado
  questions: Question[]
  currentIndex: number
  answers: number[]
  score: number
  status: 'idle' | 'playing' | 'finished'

  // Acciones
  startQuiz: () => void
  answerQuestion: (answerIndex: number) => void
  resetQuiz: () => void
}

// 3. Creamos el store con create<Tipo>()
export const useQuizStore = create<QuizStore>((set, get) => ({
  // Estado inicial
  questions: [...],
  currentIndex: 0,
  answers: [],
  score: 0,
  status: 'idle',

  // Acciones (ver tab Acciones)
  startQuiz: () => set({ status: 'playing' }),
  answerQuestion: (idx) => { /* ver tab Acciones */ },
  resetQuiz: () => set({ currentIndex: 0, answers: [], score: 0, status: 'idle' }),
}))`} />
              <div style={{ background: "#16213e", border: `1px solid ${cardBorder}`, borderRadius: 8, padding: 12, marginTop: 8 }}>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
                  <b style={{ color: accentLight }}>create&lt;QuizStore&gt;</b> recibe un callback con <b>set</b> y <b>get</b>.<br />
                  • <b style={{ color: "#f59e0b" }}>set()</b> → modifica el estado (como setState pero parcial)<br />
                  • <b style={{ color: "#f59e0b" }}>get()</b> → lee el estado actual desde dentro de una acción
                </p>
              </div>
            </Section>

            <Section title="Estructura del proyecto" accent={accent}>
              <CodeBlock label="estructura recomendada" code={`src/
├── store/
│   └── useQuizStore.ts    ← el store de Zustand
├── components/
│   ├── QuizStart.tsx
│   ├── QuizQuestion.tsx
│   └── QuizResults.tsx
├── types/
│   └── quiz.types.ts      ← interfaces TypeScript
└── App.tsx`} />
            </Section>
          </div>
        )}

        {/* TAB 2 — Acciones */}
        {tab === 2 && (
          <div>
            <Section title="Acción: answerQuestion" accent={accent}>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
                Esta es la acción más importante. Usa <b style={{ color: accentLight }}>get()</b> para leer el estado actual y <b style={{ color: accentLight }}>set()</b> para actualizarlo — igual que useReducer (#6) pero sin switch/case.
              </p>
              <CodeBlock label="useQuizStore.ts — acción answerQuestion" code={`answerQuestion: (answerIndex: number) => {
  const { currentIndex, questions, answers, score } = get()
  
  const currentQuestion = questions[currentIndex]
  const isCorrect = answerIndex === currentQuestion.correct
  const newAnswers = [...answers, answerIndex]
  const newScore = isCorrect ? score + 1 : score
  const isLast = currentIndex === questions.length - 1

  set({
    answers: newAnswers,
    score: newScore,
    currentIndex: isLast ? currentIndex : currentIndex + 1,
    status: isLast ? 'finished' : 'playing',
  })
},`} />
            </Section>

            <Section title="Middleware: persist (bonus)" accent={accent}>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                Zustand tiene middlewares. <b style={{ color: accentLight }}>persist</b> guarda el estado en localStorage automáticamente — útil para guardar el progreso del quiz.
              </p>
              <CodeBlock label="con persist middleware" code={`import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // mismo store de antes...
    }),
    {
      name: 'quiz-storage', // clave en localStorage
    }
  )
)`} />
            </Section>

            <Section title="Middleware: devtools" accent={accent}>
              <CodeBlock label="con devtools (para depurar)" code={`import { devtools } from 'zustand/middleware'

export const useQuizStore = create<QuizStore>()(
  devtools(
    (set, get) => ({ /* store */ }),
    { name: 'QuizStore' }
  )
)
// Ahora puedes ver el estado en Redux DevTools Extension`} />
            </Section>
          </div>
        )}

        {/* TAB 3 — Conexión con componentes */}
        {tab === 3 && (
          <div>
            <Section title="Usar el store en componentes" accent={accent}>
              <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
                Así como en el tema de Custom Hooks (#4), <b style={{ color: accentLight }}>useQuizStore</b> es un hook. Lo importas y extraes solo lo que necesitas — Zustand solo re-renderiza si ESE dato cambia.
              </p>
              <CodeBlock label="QuizQuestion.tsx — suscripción selectiva" code={`import { useQuizStore } from '../store/useQuizStore'

function QuizQuestion() {
  // Solo tomamos lo que necesitamos (re-render selectivo)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const questions    = useQuizStore((s) => s.questions)
  const answerQuestion = useQuizStore((s) => s.answerQuestion)

  const question = questions[currentIndex]

  return (
    <div>
      <h2>{question.question}</h2>
      {question.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => answerQuestion(i)}  // acción del store
        >
          {opt}
        </button>
      ))}
    </div>
  )
}`} />
            </Section>

            <Section title="QuizResults.tsx" accent={accent}>
              <CodeBlock label="QuizResults.tsx" code={`function QuizResults() {
  const score      = useQuizStore((s) => s.score)
  const questions  = useQuizStore((s) => s.questions)
  const resetQuiz  = useQuizStore((s) => s.resetQuiz)

  const percentage = Math.round((score / questions.length) * 100)

  return (
    <div>
      <h2>Resultado: {score}/{questions.length}</h2>
      <p>{percentage}% correcto</p>
      <button onClick={resetQuiz}>Reintentar</button>
    </div>
  )
}`} />
            </Section>

            <Section title="App.tsx — Orquestación con status" accent={accent}>
              <CodeBlock label="App.tsx" code={`function App() {
  const status = useQuizStore((s) => s.status)
  
  // Renderizado condicional según el status del store
  // Mismo patrón que usamos con useReducer en tema #6
  if (status === 'idle')     return <QuizStart />
  if (status === 'playing')  return <QuizQuestion />
  if (status === 'finished') return <QuizResults />
}`} />
              <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>
                El componente App solo se suscribe a <b>status</b>. Solo re-renderiza cuando status cambia — no cuando cambia score o answers.
              </p>
            </Section>
          </div>
        )}

        {/* TAB 4 — Quiz interactivo */}
        {tab === 4 && (
          <div>
            {state.status === "idle" && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🐻</div>
                <h2 style={{ margin: "0 0 8px", color: "#e2e8f0" }}>Quiz: Zustand + TypeScript</h2>
                <p style={{ color: "#64748b", marginBottom: 24 }}>{questions.length} preguntas · Basado en los temas del curso</p>
                <button onClick={() => dispatch({ type: "START" })} style={{ background: `linear-gradient(135deg, ${accent}, #5b21b6)`, color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                  Iniciar Quiz
                </button>
              </div>
            )}

            {state.status === "playing" && q && (
              <div>
                {/* Progress */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ color: "#64748b", fontSize: 13 }}>Pregunta {state.current + 1} de {questions.length}</span>
                  <span style={{ color: accentLight, fontSize: 13, fontWeight: 600 }}>✓ {state.score} correctas</span>
                </div>
                <div style={{ background: "#1e1b4b", borderRadius: 99, height: 6, marginBottom: 24 }}>
                  <div style={{ background: `linear-gradient(90deg, ${accent}, ${accentLight})`, height: "100%", borderRadius: 99, width: `${((state.current) / questions.length) * 100}%`, transition: "width .4s" }} />
                </div>

                {/* Question card */}
                <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 14, padding: "24px 20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: accentLight, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Pregunta #{state.current + 1}</div>
                  <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "#e2e8f0" }}>{q.question}</h3>
                </div>

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt, i) => {
                    let bg = "#16213e", border = cardBorder, color = "#94a3b8";
                    if (showAnswer) {
                      if (i === q.correct) { bg = "#14532d"; border = "#22c55e"; color = "#86efac"; }
                      else if (i === selected && i !== q.correct) { bg = "#450a0a"; border = "#ef4444"; color = "#fca5a5"; }
                    } else if (selected === i) { bg = "#1e1b4b"; border = accent; color = "#e2e8f0"; }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={showAnswer} style={{
                        background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "13px 16px",
                        color, fontSize: 14, textAlign: "left", cursor: showAnswer ? "default" : "pointer",
                        transition: "all .2s", fontFamily: "inherit"
                      }}>
                        <span style={{ fontWeight: 700, marginRight: 10, color: accentLight }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {state.status === "finished" && (
              <div style={{ textAlign: "center", padding: "30px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>{pct >= 70 ? "🏆" : pct >= 50 ? "📚" : "💪"}</div>
                <h2 style={{ margin: "0 0 8px", color: "#e2e8f0" }}>
                  {pct >= 70 ? "¡Excelente!" : pct >= 50 ? "¡Bien!" : "¡Sigue practicando!"}
                </h2>
                <div style={{ fontSize: 40, fontWeight: 800, color: accentLight, margin: "16px 0" }}>{state.score}/{questions.length}</div>
                <div style={{ color: "#64748b", marginBottom: 24 }}>{pct}% de respuestas correctas</div>

                {/* Barra de resultado */}
                <div style={{ background: "#1e1b4b", borderRadius: 99, height: 10, maxWidth: 300, margin: "0 auto 24px" }}>
                  <div style={{ background: pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444", height: "100%", borderRadius: 99, width: `${pct}%`, transition: "width 1s" }} />
                </div>

                {/* Detalle de respuestas */}
                <div style={{ textAlign: "left", marginBottom: 24 }}>
                  {questions.map((q, i) => {
                    const correct = state.answers[i] === q.correct;
                    return (
                      <div key={i} style={{ background: correct ? "#14532d22" : "#450a0a22", border: `1px solid ${correct ? "#22c55e44" : "#ef444444"}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontSize: 12 }}>
                        <span style={{ marginRight: 8 }}>{correct ? "✅" : "❌"}</span>
                        <span style={{ color: "#94a3b8" }}>{q.question.slice(0, 50)}...</span>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => { dispatch({ type: "RESET" }); }} style={{ background: `linear-gradient(135deg, ${accent}, #5b21b6)`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Reintentar Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#e2e8f0", paddingLeft: 12, borderLeft: `3px solid ${accent}` }}>{title}</h3>
      {children}
    </div>
  );
}
