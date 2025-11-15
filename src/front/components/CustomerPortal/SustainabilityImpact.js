import React from "react";
import "./SustainabilityImpact.css";

const SustainabilityImpact = ({ data }) => {
  const impactData = data || {
    total_co2_saved: 0,
    trees_equivalent: 0,
    equivalent_cars: 0,
    total_investment: 0,
  };

  const impactMetrics = [
    {
      icon: "🌱",
      value: impactData.total_co2_saved?.toFixed(1) || "0",
      unit: "toneladas",
      label: "CO2 Ahorrado",
      description: "Equivalente a las emisiones anuales de",
    },
    {
      icon: "🌳",
      value: impactData.trees_equivalent?.toFixed(0) || "0",
      unit: "árboles",
      label: "Equivalente en Árboles",
      description: "Capacidad de absorción equivalente a",
    },
    {
      icon: "🚗",
      value: impactData.equivalent_cars?.toFixed(1) || "0",
      unit: "coches",
      label: "Equivalente en Coches",
      description: "Emisiones anuales equivalentes a",
    },
    {
      icon: "⚡",
      value: (impactData.total_co2_saved * 1200)?.toFixed(0) || "0",
      unit: "kWh",
      label: "Energía Limpia",
      description: "Energía solar equivalente a",
    },
  ];

  return (
    <div className="sustainability-impact">
      <div className="impact-header">
        <h3>🌍 Mi Impacto Sostenible</h3>
        <p>Tu contribución al planeta a través de elecciones conscientes</p>
      </div>

      <div className="impact-metrics-grid">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="impact-metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-data">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-unit">{metric.unit}</span>
            </div>
            <div className="metric-info">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-description">
                {metric.description} {metric.value} {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progreso de Sostenibilidad */}
      <div className="sustainability-progress">
        <h4>📊 Mi Progreso de Sostenibilidad</h4>
        <div className="progress-bars">
          <div className="progress-item">
            <span className="progress-label">Contribución CO2</span>
            <div className="progress-bar">
              <div
                className="progress-fill co2"
                style={{
                  width: `${Math.min(
                    (impactData.total_co2_saved / 100) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <span className="progress-value">
              {((impactData.total_co2_saved / 100) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Inversión Sostenible</span>
            <div className="progress-bar">
              <div
                className="progress-fill investment"
                style={{
                  width: `${Math.min(
                    (impactData.total_investment / 10000000) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <span className="progress-value">
              {((impactData.total_investment / 10000000) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Logros y Badges */}
      <div className="sustainability-achievements">
        <h4>🏆 Mis Logros Sostenibles</h4>
        <div className="achievements-grid">
          <div className="achievement-card unlocked">
            <span className="achievement-icon">🌱</span>
            <span className="achievement-title">Pionero Verde</span>
            <span className="achievement-desc">
              Primera cotización sostenible
            </span>
          </div>
          <div
            className={`achievement-card ${
              impactData.total_co2_saved >= 10 ? "unlocked" : "locked"
            }`}
          >
            <span className="achievement-icon">🌍</span>
            <span className="achievement-title">Guardian del Planeta</span>
            <span className="achievement-desc">
              Ahorrar 10+ toneladas de CO2
            </span>
          </div>
          <div
            className={`achievement-card ${
              impactData.total_investment >= 1000000 ? "unlocked" : "locked"
            }`}
          >
            <span className="achievement-icon">💎</span>
            <span className="achievement-title">Inversor Consciente</span>
            <span className="achievement-desc">
              Invertir $1M+ en sostenibilidad
            </span>
          </div>
          <div className="achievement-card upcoming">
            <span className="achievement-icon">🚀</span>
            <span className="achievement-title">Innovador Sostenible</span>
            <span className="achievement-desc">Próximo logro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityImpact;
