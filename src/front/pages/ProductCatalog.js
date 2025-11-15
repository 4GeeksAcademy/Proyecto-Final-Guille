import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CustomerLayout from "../components/CustomerPortal/CustomerLayout";
import ProductCard from "../components/Shared/ProductCard";
import "./ProductCatalog.css";

const ProductCatalog = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/products`);

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [
    { id: "all", name: "Todos los Productos", icon: "🌟" },
    { id: "solar_yacht", name: "Solar Yachts", icon: "🛥️" },
    { id: "eco_jet", name: "Eco Jets", icon: "✈️" },
    { id: "sustainable_resort", name: "Eco Resorts", icon: "🏝️" },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="loading">Cargando catálogo...</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="product-catalog">
        <div className="catalog-header">
          <h1>🛍️ Catálogo de Productos</h1>
          <p>Descubre nuestra exclusiva colección de lujo sostenible</p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="catalog-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="catalog-stats">
          <div className="stat">
            <span className="stat-number">{filteredProducts.length}</span>
            <span className="stat-label">Productos encontrados</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {filteredProducts
                .reduce((sum, product) => sum + product.co2_savings, 0)
                .toFixed(0)}
              t
            </span>
            <span className="stat-label">CO2 potencial ahorrado</span>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                userRole={user?.role}
              />
            ))
          ) : (
            <div className="no-products">
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>

        {/* Información de Sostenibilidad */}
        <div className="sustainability-banner">
          <div className="banner-content">
            <h3>🌍 Cada compra hace la diferencia</h3>
            <p>
              Nuestros productos están diseñados para reducir hasta un 95% las
              emisiones de CO2 comparado con alternativas tradicionales. Tu
              elección contribuye a un futuro más sostenible.
            </p>
            <div className="impact-metrics">
              <div className="impact-metric">
                <span>♻️ 100%</span>
                <small>Energía Renovable</small>
              </div>
              <div className="impact-metric">
                <span>🌱 0</span>
                <small>Emisiones Directas</small>
              </div>
              <div className="impact-metric">
                <span>⚡ 85%</span>
                <small>Eficiencia Energética</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProductCatalog;
