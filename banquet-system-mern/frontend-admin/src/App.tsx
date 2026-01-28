import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser } from './api/auth';

function App() {
  const user = getCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="overview" element={<Dashboard />} />
                <Route path="docs" element={<Dashboard />} />
                <Route path="payments" element={<Dashboard />} />
                <Route path="final" element={<Dashboard />} />
                <Route
                  path="staff"
                  element={
                    <ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN2']}>
                      <Dashboard>
                        <StaffManagement />
                      </Dashboard>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            user ? (
              user.role === 'ADMIN1' ? <Navigate to="/dashboard/docs" replace /> :
                user.role === 'ADMIN2' ? <Navigate to="/dashboard/payments" replace /> :
                  <Navigate to="/dashboard/overview" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
