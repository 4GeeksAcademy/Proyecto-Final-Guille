import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Componentes
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoginPortal from './components/DualAccess/LoginPortal.jsx';
import ProductCatalog from './pages/ProductCatalog.jsx';
import ProductDetail from './components/CustomerPortal/Configurator.jsx';
import QuoteHistory from './pages/QuoteHistory.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import BusinessDashboard from './pages/BusinessDashboard.jsx';
import Home from './pages/Home.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando EcoLuxury Craft...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              user ? <Navigate to={user.role === 'business' ? '/business' : '/customer'} /> : <LoginPortal />
            } />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:productId" element={<ProductDetail />} />

            {/* Rutas protegidas - Cliente */}
            <Route path="/customer" element={
              user ? <CustomerDashboard /> : <Navigate to="/login" />
            } />
            <Route path="/quote-history" element={
              user ? <QuoteHistory /> : <Navigate to="/login" />
            } />

            {/* Rutas protegidas - Empresa */}
            <Route path="/business" element={
              user && user.role === 'business' ? <BusinessDashboard /> : <Navigate to="/login" />
            } />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;