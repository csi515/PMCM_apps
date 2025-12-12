import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp, Login, PasswordReset, Sidebar, Header, DataImportExport } from '@repo/ui';
import { ReactNode } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import ECRManagement from './components/Collaboration/ECRManagement';
import AuditTrail from './components/Collaboration/AuditTrail';
import Statistics from './components/Analytics/Statistics';
import WorkflowRules from './components/Workflow/WorkflowRules';
import ProjectDetail from './components/Project/ProjectDetail';
import WeeklyReportForm from './components/Reports/WeeklyReportForm';
import KanbanBoard from './components/Project/KanbanBoard';
import NotificationSettings from './components/Settings/NotificationSettings';

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'APPROVER' | 'USER';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// 메인 레이아웃
interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/password-reset" element={<PasswordReset />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* QMS Modules removed for GTM App */}

      <Route
        path="/collaboration/ecr"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ECRManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/collaboration/audit-trail"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AuditTrail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/weekly"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WeeklyReportForm />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Statistics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/data/import-export"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DataImportExport />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/workflow/rules"
        element={
          <ProtectedRoute>
            <MainLayout>
              <WorkflowRules />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationSettings />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/board"
        element={
          <ProtectedRoute>
            <MainLayout>
              <KanbanBoard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

