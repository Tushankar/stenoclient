import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Phase 7: React build optimized (Code Splitting / Lazy Loading)
const TypingTest = lazy(() => import("./pages/TypingTest"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DictationMode = lazy(() => import("./pages/DictationMode"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const PracticeModes = lazy(() => import("./pages/PracticeModes"));
const ErrorDrill = lazy(() => import("./pages/ErrorDrill"));
const AITraining = lazy(() => import("./pages/AITraining"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  return token && user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Phase 7 Loading Skeleton for lazy routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                  path="/login"
                  element={
                    <AuthRoute>
                      <Login />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthRoute>
                      <Register />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/practice"
                  element={
                    <ProtectedRoute>
                      <TypingTest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/training"
                  element={
                    <ProtectedRoute>
                      <PracticeModes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/error-drill"
                  element={
                    <ProtectedRoute>
                      <ErrorDrill />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-training"
                  element={
                    <ProtectedRoute>
                      <AITraining />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dictation"
                  element={
                    <ProtectedRoute>
                      <DictationMode />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "#252540", color: "#E2E8F0" },
            }}
          />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
