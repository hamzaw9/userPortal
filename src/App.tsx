import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("isLoggedIn")
  );

  return (
    <div className="h-screen">
      <Router>
        <Routes>
          <Route
            path="/"
            element={!isLoggedIn ? <AuthPage onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard
                  onLogout={() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("loggedInEmail");
                    setIsLoggedIn(false);
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;