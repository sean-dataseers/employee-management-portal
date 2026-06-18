import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Departments from './pages/Departments';
import Roles from './pages/Roles'
import Employees from './pages/Employees';
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />


        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
  path="/departments"
  element={
    <ProtectedRoute>
      <Layout>
        <Departments />
      </Layout>
    </ProtectedRoute>
  }
/>
  <Route path="/" element={<Navigate to="/login" />} />
        <Route
  path="/roles"
  element={
    <ProtectedRoute>
      <Layout>
        <Roles />
      </Layout>
    </ProtectedRoute>
  }
  />
    <Route path="/" element={<Navigate to="/login" /> } />
          <Route
    path = "/employees"
    element={
      <ProtectedRoute>
      <Layout>
        <Employees />
      </Layout>
    </ProtectedRoute>
    }
    />
      </Routes>
    </BrowserRouter>
  );
}

export default App;