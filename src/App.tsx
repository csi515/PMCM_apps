import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { ReactNode } from 'react';
import Login from './components/Auth/Login';
import PasswordReset from './components/Auth/PasswordReset';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import VOCManagement from './components/Phase1/VOCManagement';
import CriticalCharacteristics from './components/Phase1/CriticalCharacteristics';
import DFMEA from './components/Phase2/DFMEA';
import ProcessFlow from './components/Phase3/ProcessFlow';
import PFMEA from './components/Phase3/PFMEA';
import ControlPlan from './components/Phase3/ControlPlan';
import SPCAnalysis from './components/Phase4/SPCAnalysis';
import MSAAnalysis from './components/Phase4/MSAAnalysis';
import PPAPManagement from './components/Phase5/PPAPManagement';
import ECRManagement from './components/Collaboration/ECRManagement';
import AuditTrail from './components/Collaboration/AuditTrail';
import ReportGenerator from './components/Reports/ReportGenerator';
import Statistics from './components/Analytics/Statistics';
import DataImportExport from './components/Common/DataImportExport';
import WorkflowRules from './components/Workflow/WorkflowRules';
import NotificationSettings from './components/Settings/NotificationSettings';
import FMEATemplates from './components/Templates/FMEATemplates';
import QualityIssues from './components/Quality/QualityIssues';

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'APPROVER' | 'USER';
}

function ProtectedRoute({ children, requiredRole = null }: ProtectedRouteProps) {
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
      
      <Route
        path="/phase1/voc"
        element={
          <ProtectedRoute>
            <MainLayout>
              <VOCManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase1/characteristics"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CriticalCharacteristics />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase2/dfmea"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DFMEA />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase3/process-flow"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProcessFlow />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase3/pfmea"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PFMEA />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase3/control-plan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ControlPlan />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase4/spc"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SPCAnalysis />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase4/msa"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MSAAnalysis />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/phase5/ppap"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PPAPManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
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
        path="/quality/issues"
        element={
          <ProtectedRoute>
            <MainLayout>
              <QualityIssues />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportGenerator />
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
        path="/templates/fmea"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FMEATemplates />
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

