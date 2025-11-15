import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CustomerLayout from "../components/CustomerPortal/CustomerLayout";
import SustainabilityImpact from "../components/CustomerPortal/SustainabilityImpact";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [personalImpact, setPersonalImpact] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch cotizaciones recientes
      const quotesResponse = await fetch(
        `${process.env.BACKEND_URL}/api/quotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch analytics personales
      const analyticsResponse = await fetch(
        `${process.env.BACKEND_URL}/api/analytics/customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (quotesResponse.ok) {
        const quotesData = await quotesResponse.json();
        setRecentQuotes(quotesData.slice(0, 3)); // Últimas 3 cotizaciones
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setPersonalImpact(analyticsData.personal_impact);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="loading">Cargando tu dashboard...</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="customer-dashboard">
        {/* Hero Personalizado */}
        <div className="customer-hero">
          <h1>Bienvenido de vuelta, {user?.email} 👋</h1>
          <p>Continúa diseñando tu experiencia de lujo sostenible</p>
        </div>

        <div className="dashboard-grid">
          {/* Acceso Rápido al Configurador */}
          <div className="quick-actions-card">
            <h3>🚀 Comenzar Nueva Configuración</h3>
            <p>Diseña tu producto de lujo sostenible desde cero</p>
            <div className="product-options">
              <a
                href="/customer/products?category=solar_yacht"
                className="product-card"
              >
                <div className="product-icon">🛥️</div>
                <span>Solar Yacht</span>
                <small>Desde $2.8M</small>
              </a>
              <a
                href="/customer/products?category=eco_jet"
                className="product-card"
              >
                <div className="product-icon">✈️</div>
                <span>Eco Jet</span>
                <small>Desde $7.2M</small>
              </a>
              <a
                href="/customer/products?category=sustainable_resort"
                className="product-card"
              >
                <div className="product-icon">🏝️</div>
                <span>Eco Resort</span>
                <small>Desde $150K</small>
              </a>
            </div>
          </div>

          {/* Impacto de Sostenibilidad */}
          <SustainabilityImpact data={personalImpact} />

          {/* Cotizaciones Recientes */}
          <div className="recent-quotes-card">
            <h3>📋 Mis Cotizaciones Recientes</h3>
            <div className="quotes-list">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <div key={quote.id} className="quote-item">
                    <div className="quote-info">
                      <span className="product-name">{quote.product_name}</span>
                      <span className="quote-date">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="quote-details">
                      <span className={`status-badge ${quote.status}`}>
                        {quote.status}
                      </span>
                      <span className="quote-price">
                        ${quote.total_price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="sustainability-badge">
                      🌱 {quote.sustainability_score}%
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-quotes">
                  <p>Aún no tienes cotizaciones</p>
                  <a href="/customer/products" className="btn-outline">
                    Crear primera cotización
                  </a>
                </div>
              )}
            </div>
            {recentQuotes.length > 0 && (
              <a href="/customer/quotes" className="view-all-link">
                Ver todas las cotizaciones →
              </a>
            )}
          </div>

          {/* Estadísticas Rápidas */}
          <div className="quick-stats-card">
            <h3>📊 Mi Resumen</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{recentQuotes.length}</span>
                <span className="stat-label">Cotizaciones</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {recentQuotes.filter((q) => q.status === "approved").length}
                </span>
                <span className="stat-label">Aprobadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  $
                  {recentQuotes
                    .filter((q) => q.status === "approved")
                    .reduce((sum, q) => sum + (q.total_price || 0), 0)
                    .toLocaleString()}
                </span>
                <span className="stat-label">Inversión Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
