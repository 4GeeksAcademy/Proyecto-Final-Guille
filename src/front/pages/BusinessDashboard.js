import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BusinessLayout from "../components/BusinessPortal/BusinessLayout";
import AnalyticsDashboard from "../components/BusinessPortal/AnalyticsDashboard";
import RealTimeMetrics from "../components/BusinessPortal/RealTimeMetrics";
import "./BusinessDashboard.css";

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [businessData, setBusinessData] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    fetchBusinessData();
  }, [timeRange]);

  const fetchBusinessData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.BACKEND_URL}/api/analytics/business`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBusinessData(data);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BusinessLayout>
        <div className="loading">Cargando dashboard empresarial...</div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="business-dashboard">
        {/* Header con KPIs */}
        <div className="kpi-header">
          <div className="kpi-card revenue">
            <span className="kpi-value">
              ${businessData.kpis?.total_revenue?.toLocaleString() || "0"}
            </span>
            <span className="kpi-label">Revenue Total</span>
            <span className="kpi-trend positive">+12%</span>
          </div>

          <div className="kpi-card quotes">
            <span className="kpi-value">
              {businessData.kpis?.active_quotes || 0}
            </span>
            <span className="kpi-label">Cotizaciones Activas</span>
            <span className="kpi-trend positive">+8%</span>
          </div>

          <div className="kpi-card sustainability">
            <span className="kpi-value">
              {businessData.kpis?.total_co2_saved?.toFixed(0) || 0}t
            </span>
            <span className="kpi-label">CO2 Ahorrado</span>
            <span className="kpi-trend positive">+15%</span>
          </div>

          <div className="kpi-card conversion">
            <span className="kpi-value">
              {businessData.kpis?.conversion_rate?.toFixed(1) || 0}%
            </span>
            <span className="kpi-label">Tasa Conversión</span>
            <span className="kpi-trend neutral">+2%</span>
          </div>
        </div>

        {/* Selector de Rango de Tiempo */}
        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === "weekly" ? "active" : ""}`}
            onClick={() => setTimeRange("weekly")}
          >
            Semanal
          </button>
          <button
            className={`time-btn ${timeRange === "monthly" ? "active" : ""}`}
            onClick={() => setTimeRange("monthly")}
          >
            Mensual
          </button>
          <button
            className={`time-btn ${timeRange === "quarterly" ? "active" : ""}`}
            onClick={() => setTimeRange("quarterly")}
          >
            Trimestral
          </button>
        </div>

        <div className="dashboard-content">
          {/* Métricas en Tiempo Real */}
          <div className="realtime-section">
            <RealTimeMetrics data={businessData} />
          </div>

          {/* Dashboard Analítico Principal */}
          <div className="analytics-section">
            <AnalyticsDashboard data={businessData} timeRange={timeRange} />
          </div>

          {/* Insights y Recomendaciones */}
          <div className="insights-section">
            <div className="insights-card">
              <h3>💡 Insights del Negocio</h3>
              <div className="insights-list">
                <div className="insight-item positive">
                  <span className="insight-icon">📈</span>
                  <div className="insight-content">
                    <strong>Alta demanda en Solar Yachts</strong>
                    <p>45% de crecimiento en cotizaciones este mes</p>
                  </div>
                </div>
                <div className="insight-item warning">
                  <span className="insight-icon">⚠️</span>
                  <div className="insight-content">
                    <strong>Optimizar tiempos de respuesta</strong>
                    <p>Tiempo promedio de respuesta: 3.2 días</p>
                  </div>
                </div>
                <div className="insight-item positive">
                  <span className="insight-icon">🌱</span>
                  <div className="insight-content">
                    <strong>Clientes más conscientes</strong>
                    <p>78% eligen opciones sostenibles premium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="quick-actions">
              <h3>🚀 Acciones Rápidas</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <span className="btn-icon">📊</span>
                  <span>Generar Reporte</span>
                </button>
                <button className="action-btn">
                  <span className="btn-icon">📧</span>
                  <span>Contactar Clientes</span>
                </button>
                <button className="action-btn">
                  <span className="btn-icon">🔄</span>
                  <span>Actualizar Inventario</span>
                </button>
                <button className="action-btn">
                  <span className="btn-icon">🌍</span>
                  <span>Reporte Sostenibilidad</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashboard;
