import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CustomerLayout from "../components/CustomerPortal/CustomerLayout";
import "./QuoteHistory.css";

const QuoteHistory = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.BACKEND_URL}/api/quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes =
    selectedStatus === "all"
      ? quotes
      : quotes.filter((quote) => quote.status === selectedStatus);

  const statusFilters = [
    { value: "all", label: "Todos", count: quotes.length },
    {
      value: "draft",
      label: "Borrador",
      count: quotes.filter((q) => q.status === "draft").length,
    },
    {
      value: "submitted",
      label: "Enviadas",
      count: quotes.filter((q) => q.status === "submitted").length,
    },
    {
      value: "approved",
      label: "Aprobadas",
      count: quotes.filter((q) => q.status === "approved").length,
    },
    {
      value: "rejected",
      label: "Rechazadas",
      count: quotes.filter((q) => q.status === "rejected").length,
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { class: "draft", label: "Borrador" },
      submitted: { class: "submitted", label: "Enviada" },
      approved: { class: "approved", label: "Aprobada" },
      rejected: { class: "rejected", label: "Rechazada" },
    };

    const config = statusConfig[status] || { class: "draft", label: status };
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="loading">Cargando historial de cotizaciones...</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="quote-history">
        <div className="history-header">
          <h1>📋 Mis Cotizaciones</h1>
          <p>
            Gestiona y revisa todas tus cotizaciones de productos sostenibles
          </p>
        </div>

        {/* Filtros de Estado */}
        <div className="status-filters">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`status-filter ${
                selectedStatus === filter.value ? "active" : ""
              }`}
              onClick={() => setSelectedStatus(filter.value)}
            >
              <span className="filter-label">{filter.label}</span>
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </div>

        {/* Lista de Cotizaciones */}
        <div className="quotes-list">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => (
              <div key={quote.id} className="quote-card">
                <div className="quote-header">
                  <div className="quote-title">
                    <h3>{quote.product_name}</h3>
                    <span className="quote-date">
                      {new Date(quote.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                <div className="quote-details">
                  <div className="detail-group">
                    <span className="detail-label">Valor Total</span>
                    <span className="detail-value price">
                      ${quote.total_price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Ahorro CO2</span>
                    <span className="detail-value co2-savings">
                      {quote.co2_savings?.toFixed(1)} toneladas
                    </span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Score Sostenibilidad</span>
                    <span className="detail-value sustainability">
                      🌱 {quote.sustainability_score}%
                    </span>
                  </div>
                </div>

                <div className="quote-actions">
                  <button className="btn-outline">📄 Ver Detalles</button>
                  {quote.status === "draft" && (
                    <button className="btn-primary">
                      ✏️ Continuar Configuración
                    </button>
                  )}
                  {quote.status === "submitted" && (
                    <button className="btn-secondary">
                      📧 Contactar Asesor
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-quotes">
              <div className="no-quotes-icon">📋</div>
              <h3>No hay cotizaciones</h3>
              <p>
                {selectedStatus === "all"
                  ? "Aún no has creado ninguna cotización"
                  : `No hay cotizaciones con estado "${selectedStatus}"`}
              </p>
              {selectedStatus === "all" && (
                <a href="/customer/products" className="btn-primary">
                  Crear Primera Cotización
                </a>
              )}
            </div>
          )}
        </div>

        {/* Resumen Estadístico */}
        {quotes.length > 0 && (
          <div className="quotes-summary">
            <h3>📊 Resumen de Cotizaciones</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <span className="summary-value">{quotes.length}</span>
                <span className="summary-label">Total</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">
                  $
                  {quotes
                    .reduce((sum, q) => sum + (q.total_price || 0), 0)
                    .toLocaleString()}
                </span>
                <span className="summary-label">Valor Total</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">
                  {quotes
                    .reduce((sum, q) => sum + (q.co2_savings || 0), 0)
                    .toFixed(0)}
                  t
                </span>
                <span className="summary-label">CO2 Ahorrado</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">
                  {(
                    quotes.reduce(
                      (sum, q) => sum + (q.sustainability_score || 0),
                      0
                    ) / quotes.length
                  ).toFixed(0)}
                  %
                </span>
                <span className="summary-label">Score Promedio</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default QuoteHistory;
