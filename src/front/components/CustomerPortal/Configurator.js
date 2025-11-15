import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

const Configurator = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [configuration, setConfiguration] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [sustainabilityScore, setSustainabilityScore] = useState(100);

  const configurationLayers = {
    solar_yacht: {
      name: "Solar Yacht",
      steps: [
        {
          id: "energy",
          name: "⚡ Sistema de Energía",
          options: [
            {
              id: "solar_basic",
              name: "Paneles Solares Estándar",
              description: "Sistema solar de 45 kWp con baterías Tesla",
              price: 0,
              sustainability: 25,
              image: "/solar-basic.jpg",
            },
            {
              id: "solar_premium",
              name: "Solar + Hidrógeno",
              description:
                "Sistema híbrido solar-hidrógeno para autonomía ilimitada",
              price: 350000,
              sustainability: 50,
              image: "/solar-premium.jpg",
            },
            {
              id: "solar_advanced",
              name: "Bio-Photosynthetic",
              description: "Sistema bio-fotosintético que genera oxígeno",
              price: 600000,
              sustainability: 75,
              image: "/solar-advanced.jpg",
            },
          ],
        },
        {
          id: "exterior",
          name: "🎨 Exterior y Acabados",
          options: [
            {
              id: "exterior_standard",
              name: "Fibra de Carbono Reciclada",
              description: "Materiales 85% reciclados, peso optimizado",
              price: 0,
              sustainability: 20,
              image: "/exterior-standard.jpg",
            },
            {
              id: "exterior_premium",
              name: "Mycelium Bio-Composite",
              description: "Materiales biodegradables auto-reparables",
              price: 220000,
              sustainability: 45,
              image: "/exterior-premium.jpg",
            },
          ],
        },
        {
          id: "interior",
          name: "🏠 Interior y Confort",
          options: [
            {
              id: "interior_standard",
              name: "Bambú Engineering",
              description: "Maderas certificadas y materiales naturales",
              price: 0,
              sustainability: 30,
              image: "/interior-standard.jpg",
            },
            {
              id: "interior_premium",
              name: "Ocean Plastic Premium",
              description: "Materiales de plástico oceánico reciclado",
              price: 180000,
              sustainability: 60,
              image: "/interior-premium.jpg",
            },
            {
              id: "interior_luxury",
              name: "Lab-Grown Luxury",
              description: "Marfiles y maderas de cultivo celular",
              price: 350000,
              sustainability: 40,
              image: "/interior-luxury.jpg",
            },
          ],
        },
        {
          id: "propulsion",
          name: "🚀 Sistema de Propulsión",
          options: [
            {
              id: "propulsion_electric",
              name: "Eléctrico Directo",
              description: "Propulsión 100% eléctrica silenciosa",
              price: 0,
              sustainability: 35,
              image: "/propulsion-electric.jpg",
            },
            {
              id: "propulsion_hydrogen",
              name: "Hidrógeno Solar",
              description: "Celdas de hidrógeno, solo emite vapor",
              price: 450000,
              sustainability: 70,
              image: "/propulsion-hydrogen.jpg",
            },
          ],
        },
        {
          id: "extras",
          name: "🌟 Extras Premium",
          options: [
            {
              id: "extra_heli",
              name: "Helipuerto Integrado",
              description: "Plataforma para helicóptero eléctrico",
              price: 250000,
              sustainability: -10,
              image: "/extra-heli.jpg",
            },
            {
              id: "extra_submarine",
              name: "Submarino Personal",
              description: "Submarino eléctrico para exploración",
              price: 500000,
              sustainability: 5,
              image: "/extra-submarine.jpg",
            },
            {
              id: "extra_coral",
              name: "Sistema Regeneración Coral",
              description: "Contribuye a regenerar arrecifes de coral",
              price: 75000,
              sustainability: 80,
              image: "/extra-coral.jpg",
            },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  useEffect(() => {
    calculateTotals();
  }, [configuration]);

  const fetchProductData = async () => {
    try {
      const mockProduct = {
        id: productId,
        name: "Solar Yacht 76 Eco",
        basePrice: 2800000,
        category: "solar_yacht",
        description: "Yate de lujo 100% sostenible con autonomía ilimitada",
      };
      setProduct(mockProduct);
      setTotalPrice(mockProduct.basePrice);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const calculateTotals = () => {
    if (!product) return;

    let calculatedPrice = product.basePrice;
    let calculatedSustainability = 100;

    Object.values(configuration).forEach((option) => {
      if (option) {
        calculatedPrice += option.price;
        calculatedSustainability += option.sustainability;
      }
    });

    setTotalPrice(calculatedPrice);
    setSustainabilityScore(
      Math.min(Math.max(calculatedSustainability, 0), 200)
    );
  };

  const handleOptionSelect = (stepId, option) => {
    setConfiguration((prev) => ({
      ...prev,
      [stepId]: option,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < configurationLayers.solar_yacht.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createQuote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/quotes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            configuration: configuration,
            total_price: totalPrice,
            sustainability_score: sustainabilityScore,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("✅ Cotización creada exitosamente");
        window.location.href = "/customer/quotes";
      } else {
        throw new Error("Error creating quote");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("❌ Error al crear la cotización");
    }
  };

  if (!product) {
    return <div className="loading">Cargando configurador...</div>;
  }

  const currentStepData = configurationLayers.solar_yacht.steps[currentStep];
  const isLastStep =
    currentStep === configurationLayers.solar_yacht.steps.length - 1;

  return (
    <div className="configurator">
      <div className="configurator-header">
        <h1>⚙️ Configurar {product.name}</h1>
        <div className="progress-steps">
          {configurationLayers.solar_yacht.steps.map((step, index) => (
            <div
              key={step.id}
              className={`progress-step ${
                index === currentStep ? "active" : ""
              } ${index < currentStep ? "completed" : ""}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-name">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="configurator-content">
        <div className="options-panel">
          <h2>{currentStepData.name}</h2>
          <div className="options-grid">
            {currentStepData.options.map((option) => (
              <div
                key={option.id}
                className={`option-card ${
                  configuration[currentStepData.id]?.id === option.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleOptionSelect(currentStepData.id, option)}
              >
                <div className="option-image">
                  <div className="image-placeholder">🖼️</div>
                </div>
                <div className="option-info">
                  <h3>{option.name}</h3>
                  <p>{option.description}</p>
                  <div className="option-details">
                    <span className="price">
                      {option.price > 0
                        ? `+$${option.price.toLocaleString()}`
                        : "Incluido"}
                    </span>
                    <span
                      className={`sustainability ${
                        option.sustainability > 0 ? "positive" : "negative"
                      }`}
                    >
                      {option.sustainability > 0 ? "+" : ""}
                      {option.sustainability}% 🌱
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="navigation-buttons">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="btn-secondary"
            >
              ← Anterior
            </button>

            {!isLastStep ? (
              <button onClick={handleNextStep} className="btn-primary">
                Siguiente →
              </button>
            ) : (
              <button onClick={createQuote} className="btn-success">
                🎯 Finalizar Cotización
              </button>
            )}
          </div>
        </div>

        <div className="summary-panel">
          <div className="summary-card">
            <h3>📊 Resumen de Configuración</h3>

            <div className="price-summary">
              <div className="price-item">
                <span>Precio Base:</span>
                <span>${product.basePrice.toLocaleString()}</span>
              </div>

              {Object.entries(configuration).map(([stepId, option]) => (
                <div key={stepId} className="price-item">
                  <span>{option.name}:</span>
                  <span>+${option.price.toLocaleString()}</span>
                </div>
              ))}

              <div className="price-total">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="sustainability-summary">
              <h4>🌍 Impacto Sostenible</h4>
              <div className="sustainability-score">
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${sustainabilityScore / 2}%` }}
                  ></div>
                </div>
                <span className="score-value">{sustainabilityScore}%</span>
              </div>
              <p>Score de sostenibilidad de tu configuración</p>
            </div>

            <div className="configuration-preview">
              <h4>🎨 Vista Previa</h4>
              <div className="preview-items">
                {Object.entries(configuration).map(([stepId, option]) => (
                  <div key={stepId} className="preview-item">
                    <span className="preview-step">
                      {
                        configurationLayers.solar_yacht.steps.find(
                          (s) => s.id === stepId
                        )?.name
                      }
                      :
                    </span>
                    <span className="preview-option">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
