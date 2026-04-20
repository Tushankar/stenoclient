import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
      <div className="text-center max-w-2xl bg-[var(--color-surface)] p-12 rounded-xl shadow-2xl border border-[var(--color-border)]">
        <h1 className="text-5xl font-extrabold mb-6 animate-pulse">
          Master Steno. Beat the Exam.
        </h1>
        <p className="text-xl text-[var(--color-text-muted)] mb-8">
          AI-powered steno training for SSC, Railway & Court exams.
        </p>

        <div className="text-sm bg-[var(--color-surface-2)] p-4 rounded-lg mb-8 typing-font inline-block border border-[var(--color-primary-dark)] text-[var(--color-accent)] animate-bounce font-mono">
          &gt; typing simulation initialized...
        </div>

        <div className="flex justify-center gap-6">
          <Link
            to="/register"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg text-lg hover:bg-[var(--color-primary-dark)] transition-transform hover:scale-105 font-bold shadow-lg shadow-[var(--color-primary-dark)]/50"
          >
            Start Free Practice
          </Link>
          <button className="bg-[var(--color-surface-2)] text-[var(--color-text)] px-8 py-3 rounded-lg text-lg hover:bg-[var(--color-border)] transition border border-[var(--color-border)]">
            Watch Demo
          </button>
        </div>

        <div className="mt-12 flex justify-around text-center border-t border-[var(--color-border)] pt-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[var(--color-accent)]">
              10k+
            </span>
            <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
              Aspirants
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[var(--color-primary-light)]">
              98%
            </span>
            <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
              Pass Rate
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[var(--color-warning)]">
              500+
            </span>
            <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
              Passages
            </span>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl">
        {[
          "Speed Tracking",
          "Dictation Mode",
          "AI Feedback",
          "Weak Key Detection",
        ].map((feat, i) => (
          <div
            key={i}
            className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)] text-center text-[var(--color-text)] hover:border-[var(--color-primary)] cursor-default transition-colors"
          >
            {feat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
