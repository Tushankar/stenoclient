import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  Keyboard,
  Headphones,
  Brain,
  Trophy,
  Shield,
  LogOut,
  LogIn,
  Play,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 transition-all duration-300 border-b-2 rounded-t-md font-medium ${
      isActive
        ? "border-[var(--color-primary-light)] text-[var(--color-primary-light)] bg-[var(--color-primary)]/10 [text-shadow:0_0_12px_var(--color-primary-light)]"
        : "border-transparent text-[var(--color-text)] hover:text-[var(--color-primary-light)] hover:bg-[var(--color-surface-2)]"
    }`;

  const navLinkClassSpecial =
    (colorTheme) =>
    ({ isActive }) => {
      let classes = "";
      if (colorTheme === "indigo") {
        classes = isActive
          ? "border-indigo-400 text-indigo-400 bg-indigo-500/10 [text-shadow:0_0_12px_#818cf8]"
          : "border-transparent text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10";
      } else if (colorTheme === "yellow") {
        classes = isActive
          ? "border-yellow-400 text-yellow-400 bg-yellow-500/10 [text-shadow:0_0_12px_#facc15]"
          : "border-transparent text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10";
      } else if (colorTheme === "red") {
        classes = isActive
          ? "border-red-400 text-red-400 bg-red-500/10 [text-shadow:0_0_12px_#f87171]"
          : "border-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10";
      }

      return `flex items-center gap-2 px-3 py-2 transition-all duration-300 border-b-2 rounded-t-md font-medium ${classes}`;
    };

  return (
    <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 px-8 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-black text-[var(--color-primary-light)] hover:[text-shadow:0_0_15px_var(--color-primary-light)] transition-all"
      >
        <Keyboard className="text-[var(--color-primary-light)]" size={28} />
        StenoMaster
      </Link>
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/practice" className={navLinkClass}>
              <Keyboard size={18} />
              Practice
            </NavLink>
            <NavLink to="/dictation" className={navLinkClass}>
              <Headphones size={18} />
              Dictation
            </NavLink>
            <NavLink to="/training" className={navLinkClassSpecial("indigo")}>
              <Brain size={18} />
              Training Center
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={navLinkClassSpecial("yellow")}
            >
              <Trophy size={18} />
              Leaderboard
            </NavLink>
            {user.role === "admin" && (
              <NavLink to="/admin" className={navLinkClassSpecial("red")}>
                <Shield size={18} />
                Admin
              </NavLink>
            )}
            <span className="text-[var(--color-text-muted)] mx-2">|</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-text)]">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[var(--color-surface-2)] px-4 py-2 rounded text-sm hover:bg-[var(--color-error)] hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-[var(--color-text)] hover:text-[var(--color-primary-light)] transition-colors"
            >
              <LogIn size={18} />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-[var(--color-primary)] px-5 py-2 rounded text-white font-bold hover:bg-[var(--color-primary-dark)] hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Play size={18} />
              Start Free Practice
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
