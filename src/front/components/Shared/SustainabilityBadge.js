import React from "react";
import "./SustainabilityBadge.css";

const SustainabilityBadge = ({ co2Savings, solarPower, efficiency }) => {
  const calculateSustainabilityScore = () => {
    let score = 0;

    // Puntos por ahorro de CO2
    if (co2Savings >= 50) score += 40;
    else if (co2Savings >= 25) score += 30;
    else if (co2Savings >= 10) score += 20;
    else score += 10;

    // Puntos por potencia solar
    if (solarPower >= 50) score += 40;
    else if (solarPower >= 25) score += 30;
    else if (solarPower >= 10) score += 20;
    else score += 10;

    // Puntos por eficiencia
    if (efficiency === "A+++") score += 20;
    else if (efficiency === "A++") score += 15;
    else if (efficiency === "A+") score += 10;
    else score += 5;

    return Math.min(score, 100);
  };

  const getBadgeLevel = (score) => {
    if (score >= 90) return { level: "platinum", label: "Platino" };
    if (score >= 75) return { level: "gold", label: "Oro" };
    if (score >= 60) return { level: "silver", label: "Plata" };
    return { level: "bronze", label: "Bronce" };
  };

  const score = calculateSustainabilityScore();
  const badge = getBadgeLevel(score);

  return (
    <div className={`sustainability-badge ${badge.level}`}>
      <div className="badge-icon">🌿</div>
      <div className="badge-content">
        <span className="badge-level">{badge.label}</span>
        <span className="badge-score">{score}% Sostenible</span>
      </div>
    </div>
  );
};

export default SustainabilityBadge;
