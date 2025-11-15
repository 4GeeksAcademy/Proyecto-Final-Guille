import React from "react";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = ({ data, timeRange }) => {
  const {
    kpis,
    sales_by_category,
    monthly_trends,
    top_products,
    sustainability_impact,
  } = data;

  // Gráfico simple de ventas por categoría
  const SalesByCategoryChart = () => {
    const maxRevenue = Math.max(
      ...sales_by_category.map((item) => item.revenue || 0)
    );

    return (
      <div className="chart-container">
        <h4>Ventas por Categoría</h4>
        <div className="bar-chart">
          {sales_by_category.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">{item.category}</div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${((item.revenue || 0) / maxRevenue) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="bar-value">
                ${(item.revenue || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tendencias mensuales
  const MonthlyTrendsChart = () => (
    <div className="chart-container">
      <h4>Tendencias Mensuales</h4>
      <div className="line-chart">
        {monthly_trends.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-period">{trend.period}</div>
            <div className="trend-bar">
              <div
                className="trend-fill revenue"
                style={{ width: `${(trend.revenue / 1000000) * 100}%` }}
              ></div>
            </div>
            <div className="trend-stats">
              <span>${trend.revenue.toLocaleString()}</span>
              <span>{trend.quotes} quotes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Productos más populares
  const TopProductsList = () => (
    <div className="top-products-card">
      <h4>🏆 Productos Más Populares</h4>
      <div className="products-list">
        {top_products &&
          top_products.map((product, index) => (
            <div key={index} className="product-rank">
              <span className="rank-number">{index + 1}</span>
              <span className="product-name">{product[0]}</span>
              <span className="popularity-count">{product[1]} quotes</span>
            </div>
          ))}
      </div>
    </div>
  );

  // Métricas de Sostenibilidad
  const SustainabilityMetrics = () => (
    <div className="sustainability-card">
      <h4>🌍 Impacto Sostenible</h4>
      <div className="sustainability-stats">
        <div className="sustainability-metric">
          <span className="metric-value">
            {sustainability_impact?.sustainability_adoption_rate?.toFixed(1) ||
              0}
            %
          </span>
          <span className="metric-label">Adopción Sostenibilidad</span>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${
                  sustainability_impact?.sustainability_adoption_rate || 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="sustainability-metric">
          <span className="metric-value">
            {sustainability_impact?.avg_sustainability_score?.toFixed(0) || 0}%
          </span>
          <span className="metric-label">Score Sostenibilidad Promedio</span>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${
                  (sustainability_impact?.avg_sustainability_score || 0) / 2
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>📈 Analytics Dashboard</h2>
        <div className="time-range-info">
          <span>
            Vista:{" "}
            {timeRange === "monthly"
              ? "Mensual"
              : timeRange === "weekly"
              ? "Semanal"
              : "Trimestral"}
          </span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Gráfico de Ventas por Categoría */}
        <div className="analytics-card full-width">
          <SalesByCategoryChart />
        </div>

        {/* Tendencias Mensuales */}
        <div className="analytics-card">
          <MonthlyTrendsChart />
        </div>

        {/* Productos Populares */}
        <div className="analytics-card">
          <TopProductsList />
        </div>

        {/* Métricas de Sostenibilidad */}
        <div className="analytics-card">
          <SustainabilityMetrics />
        </div>

        {/* KPIs Detallados */}
        <div className="analytics-card">
          <h4>📊 KPIs Detallados</h4>
          <div className="detailed-kpis">
            <div className="detailed-kpi">
              <span className="kpi-title">Revenue Promedio por Quote</span>
              <span className="kpi-value">
                $
                {kpis?.total_revenue && kpis.active_quotes
                  ? (kpis.total_revenue / kpis.active_quotes).toLocaleString()
                  : "0"}
              </span>
            </div>
            <div className="detailed-kpi">
              <span className="kpi-title">Tasa de Aprobación</span>
              <span className="kpi-value">
                {kpis?.conversion_rate?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="detailed-kpi">
              <span className="kpi-title">CO2 Ahorrado por Quote</span>
              <span className="kpi-value">
                {kpis?.total_co2_saved && kpis.active_quotes
                  ? (kpis.total_co2_saved / kpis.active_quotes).toFixed(1)
                  : "0"}
                t
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
