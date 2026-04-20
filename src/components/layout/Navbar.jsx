import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 px-8 flex justify-between items-center">
      <Link
        to="/"
        className="text-xl font-bold text-[var(--color-primary-light)]"
      >
        StenoMaster
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-[var(--color-primary-light)]"
            >
              Dashboard
            </Link>
            <Link
              to="/practice"
              className="hover:text-[var(--color-primary-light)]"
            >
              Practice
            </Link>
            <Link
              to="/dictation"
              className="hover:text-[var(--color-primary-light)] border border-[var(--color-border)] px-3 py-1 rounded"
            >
              Dictation
            </Link>
            <Link
              to="/training"
              className="hover:text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-indigo-400 font-bold rounded"
            >
              Training Center
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-yellow-400 border border-[var(--color-border)] px-3 py-1 rounded"
            >
              Leaderboard
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded"
              >
                Admin
              </Link>
            )}
            <span className="text-[var(--color-text-muted)]">|</span>
            <span className="text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-surface-2)] px-4 py-2 rounded text-sm hover:bg-[var(--color-error)] hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-[var(--color-primary-light)]"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[var(--color-primary)] px-4 py-2 rounded text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Start Free Practice
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
