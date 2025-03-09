// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortfolioPage from './pages/PortfolioPage';
import LedgerPage from './pages/LedgerPage';
// import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import antdTheme from './theme/antd.config';
import './App.css';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <div className="app">
        <AuthProvider>
          <FinanceProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/portfolio"
                  element={
                    <ProtectedRoute>
                      <PortfolioPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ledger"
                  element={
                    <ProtectedRoute>
                      <LedgerPage />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage setTheme={setTheme} theme={theme} />
                    </ProtectedRoute>
                  }
                /> */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </FinanceProvider>
        </AuthProvider>
      </div>
    </ConfigProvider>
  );
}

export default App;