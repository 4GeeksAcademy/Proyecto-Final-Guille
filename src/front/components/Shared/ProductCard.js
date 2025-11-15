import React from "react";
import SustainabilityBadge from "./SustainabilityBadge";
import "./ProductCard.css";

const ProductCard = ({ product, userRole }) => {
  const {
    id,
    name,
    description,
    base_price,
    category,
    type,
    co2_savings,
    solar_power,
    energy_efficiency,
    image_url,
  } = product;

  const getCategoryIcon = (category) => {
    const icons = {
      solar_yacht: "🛥️",
      eco_jet: "✈️",
      sustainable_resort: "🏝️",
    };
    return icons[category] || "🌟";
  };

  const getCategoryName = (category) => {
    const names = {
      solar_yacht: "Solar Yacht",
      eco_jet: "Eco Jet",
      sustainable_resort: "Eco Resort",
    };
    return names[category] || category;
  };

  const handleConfigure = () => {
    if (userRole === "customer") {
      // Redirigir al configurador
      window.location.href = `/customer/configure/${id}`;
    } else {
      alert("Debes iniciar sesión como cliente para configurar productos");
    }
  };

  return (
    <div className="product-card">
      {/* Badge de Sostenibilidad */}
      <SustainabilityBadge
        co2Savings={co2_savings}
        solarPower={solar_power}
        efficiency={energy_efficiency}
      />

      {/* Imagen del Producto */}
      <div className="product-image">
        {image_url ? (
          <img src={image_url} alt={name} />
        ) : (
          <div className="product-placeholder">{getCategoryIcon(category)}</div>
        )}
        <div className="product-category">
          <span className="category-icon">{getCategoryIcon(category)}</span>
          <span>{getCategoryName(category)}</span>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>

        {/* Especificaciones Técnicas */}
        <div className="product-specs">
          <div className="spec-item">
            <span className="spec-label">Ahorro CO2:</span>
            <span className="spec-value">{co2_savings} toneladas/año</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Potencia Solar:</span>
            <span className="spec-value">{solar_power} kWp</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Eficiencia:</span>
            <span className="spec-value">{energy_efficiency}</span>
          </div>
        </div>

        {/* Precio y Acción */}
        <div className="product-footer">
          <div className="product-pricing">
            <span className="price-label">
              {type === "configurable" ? "Desde" : "Precio"}
            </span>
            <span className="price-amount">${base_price.toLocaleString()}</span>
          </div>

          <button
            className={`configure-btn ${type}`}
            onClick={handleConfigure}
            disabled={userRole !== "customer"}
          >
            {type === "configurable" ? "⚙️ Configurar" : "🛍️ Comprar"}
          </button>
        </div>
      </div>

      {/* Impacto Ambiental */}
      <div className="environmental-impact">
        <div className="impact-stats">
          <div className="impact-stat">
            <span className="impact-icon">🌱</span>
            <span className="impact-value">{co2_savings}t CO2</span>
            <span className="impact-label">Ahorro Anual</span>
          </div>
          <div className="impact-stat">
            <span className="impact-icon">☀️</span>
            <span className="impact-value">{solar_power} kWp</span>
            <span className="impact-label">Energía Solar</span>
          </div>
          <div className="impact-stat">
            <span className="impact-icon">⚡</span>
            <span className="impact-value">{energy_efficiency}</span>
            <span className="impact-label">Eficiencia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
