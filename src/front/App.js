// webapp/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPortal from "./components/DualAccess/LoginPortal";
import CustomerDashboard from "./pages/CustomerDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProductCatalog from "./pages/ProductCatalog";
import QuoteHistory from "./pages/QuoteHistory";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Single from "./pages/Single";
import "./index.css";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPortal />} />
            <Route path="/home" element={<Home />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/single" element={<Single />} />

            {/* Rutas protegidas - Cliente */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/products"
              element={
                <ProtectedRoute requiredRole="customer">
                  <ProductCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/quotes"
              element={
                <ProtectedRoute requiredRole="customer">
                  <QuoteHistory />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas - Empresa */}
            <Route
              path="/business"
              element={
                <ProtectedRoute requiredRole="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
