import { useState } from "react";
import { AuthPage } from "./AuthPage";
import type { SignupFormData } from "../schemas/auth.schema";

interface DashboardProps {
  onLogout: () => void;
}

const getLoggedInUser = (): SignupFormData | null => {
  const email = localStorage.getItem("loggedInEmail") || "";
  const users: SignupFormData[] = JSON.parse(
    localStorage.getItem("userData") || "[]"
  );
  return users.find((u) => u.email === email) ?? null;
};

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [user, setUser] = useState<SignupFormData | null>(getLoggedInUser);

  const hasNames = !!user?.firstName?.trim() && !!user?.lastName?.trim();

  const handleNameSaved = () => {
    setUser(getLoggedInUser());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800 tracking-tight">
          UserPortal
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium cursor-pointer text-gray-600 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
        >
          Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Manage your personal information and account settings.
            </p>
          </header>

          {hasNames ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    First Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user!.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Last Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user!.lastName}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Your profile is fully complete. You can navigate the portal using your verified identity.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border text-left border-amber-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Complete your profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Please provide your name to continue using the dashboard features.
                </p>
              </div>
              <AuthPage showOnlyNameFields={true} onNameSaved={handleNameSaved} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;