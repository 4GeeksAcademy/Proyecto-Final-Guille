import React, { useState, useEffect } from "react";
import "./RealTimeMetrics.css";

const RealTimeMetrics = ({ data }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeQuotes, setActiveQuotes] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    // Simular datos en tiempo real
    const mockActiveQuotes = [
      {
        id: 1,
        customer: "María González",
        product: "Solar Yacht 76",
        amount: 2850000,
        time: "2 min ago",
      },
      {
        id: 2,
        customer: "Carlos Rodríguez",
        product: "Eco Jet",
        amount: 7200000,
        time: "5 min ago",
      },
      {
        id: 3,
        customer: "Ana Martínez",
        product: "Solar Yacht 76",
        amount: 3100000,
        time: "8 min ago",
      },
    ];

    setActiveQuotes(mockActiveQuotes);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="realtime-metrics">
      <div className="realtime-header">
        <h3>⚡ Métricas en Tiempo Real</h3>
        <span className="last-update">
          Actualizado:{" "}
          {currentTime.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="metrics-grid">
        {/* Cotizaciones Activas */}
        <div className="metric-card realtime">
          <div className="metric-icon">📋</div>
          <div className="metric-data">
            <span className="metric-value">
              {data.kpis?.active_quotes || 0}
            </span>
            <span className="metric-label">Cotizaciones Activas</span>
          </div>
          <div className="metric-trend positive">+12%</div>
        </div>

        {/* Conversión del Día */}
        <div className="metric-card realtime">
          <div className="metric-icon">💰</div>
          <div className="metric-data">
            <span className="metric-value">
              {data.kpis?.conversion_rate?.toFixed(1) || 0}%
            </span>
            <span className="metric-label">Tasa Conversión Hoy</span>
          </div>
          <div className="metric-trend positive">+3%</div>
        </div>

        {/* Revenue del Mes */}
        <div className="metric-card realtime">
          <div className="metric-icon">📈</div>
          <div className="metric-data">
            <span className="metric-value">
              $
              {data.kpis?.total_revenue
                ? (data.kpis.total_revenue / 1000000).toFixed(1) + "M"
                : "0"}
            </span>
            <span className="metric-label">Revenue Mes Actual</span>
          </div>
          <div className="metric-trend positive">+18%</div>
        </div>

        {/* Impacto Ambiental */}
        <div className="metric-card realtime">
          <div className="metric-icon">🌱</div>
          <div className="metric-data">
            <span className="metric-value">
              {data.kpis?.total_co2_saved?.toFixed(0) || 0}t
            </span>
            <span className="metric-label">CO2 Ahorrado Total</span>
          </div>
          <div className="metric-trend positive">+25%</div>
        </div>
      </div>

      {/* Cotizaciones Recientes en Tiempo Real */}
      <div className="recent-quotes">
        <h4>🆕 Cotizaciones Recientes</h4>
        <div className="quotes-feed">
          {activeQuotes.map((quote) => (
            <div key={quote.id} className="quote-feed-item">
              <div className="quote-avatar">{quote.customer.charAt(0)}</div>
              <div className="quote-info">
                <span className="customer-name">{quote.customer}</span>
                <span className="product-name">{quote.product}</span>
              </div>
              <div className="quote-amount">
                ${quote.amount.toLocaleString()}
              </div>
              <div className="quote-time">{quote.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas del Sistema */}
      <div className="system-alerts">
        <h4>🚨 Alertas del Sistema</h4>
        <div className="alerts-list">
          <div className="alert-item warning">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <strong>Stock Bajo en Solar Yacht 76</strong>
              <p>Solo quedan 2 unidades disponibles</p>
            </div>
          </div>
          <div className="alert-item info">
            <span className="alert-icon">ℹ️</span>
            <div className="alert-content">
              <strong>Nuevo Lead de Alto Valor</strong>
              <p>Empresa internacional interesada en flota de Eco Jets</p>
            </div>
          </div>
          <div className="alert-item positive">
            <span className="alert-icon">✅</span>
            <div className="alert-content">
              <strong>Record de Sostenibilidad</strong>
              <p>95% de clientes eligen opciones eco-premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
