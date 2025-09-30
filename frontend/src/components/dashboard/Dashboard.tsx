'use client';

import { useAuth } from '@/contexts/AuthContext';
import { RequesterDashboard } from './RequesterDashboard';
import { AgentDashboard } from './AgentDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { UserRole } from '@/types/auth';

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.REQUESTER:
        return <RequesterDashboard user={user} />;
      case UserRole.AGENT:
        return <AgentDashboard user={user} />;
      case UserRole.MANAGER:
        return <ManagerDashboard user={user} />;
      default:
        return <RequesterDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Service Desk Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      {renderDashboard()}
    </div>
  );
}

