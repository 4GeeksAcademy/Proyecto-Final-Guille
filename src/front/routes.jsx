import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importar componentes existentes
import Home from './pages/Home';
import Demo from './pages/Demo';
import Single from './pages/Single';
import Layout from './pages/Layout';

// Importar nuevos componentes del ecommerce
import ProductCatalog from './pages/ProductCatalog';
import QuoteHistory from './pages/QuoteHistory';
import BusinessDashboard from './pages/BusinessDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Configurator from './components/CustomerPortal/Configurator';
import LoginPortal from './components/DualAccess/LoginPortal';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas existentes del template */}
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/single/:theid" element={<Single />} />
      <Route path="/layout" element={<Layout />} />

      {/* Nuevas rutas del ecommerce */}
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:productId" element={<Configurator />} />
      <Route path="/quote-history" element={<QuoteHistory />} />
      <Route path="/business" element={<BusinessDashboard />} />
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/login" element={<LoginPortal />} />

      {/* Ruta catch-all - redirigir a productos como página principal */}
      <Route path="*" element={<ProductCatalog />} />
    </Routes>
  );
};

export default AppRoutes;