import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginPortal = () => {
  const [activeRole, setActiveRole] = useState("customer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    company_name: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: formData.email,
      password: formData.password,
      role: activeRole,
    };

    if (!isLogin) {
      if (activeRole === "customer") {
        userData.first_name = formData.first_name;
        userData.last_name = formData.last_name;
      } else {
        userData.company_name = formData.company_name;
        userData.contact_person =
          formData.first_name + " " + formData.last_name;
      }
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(userData);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="login-portal">
      <div className="portal-container">
        <div className="portal-header">
          <h1>🌱 EcoLuxury Configurator</h1>
          <p>Accede a tu espacio personalizado</p>
        </div>

        <div className="role-selector">
          <div
            className={`role-option ${
              activeRole === "customer" ? "active" : ""
            }`}
            onClick={() => setActiveRole("customer")}
          >
            <div className="role-icon">👤</div>
            <div className="role-info">
              <h3>Cliente</h3>
              <p>Configura y personaliza tu producto de lujo sostenible</p>
            </div>
          </div>

          <div
            className={`role-option ${
              activeRole === "business" ? "active" : ""
            }`}
            onClick={() => setActiveRole("business")}
          >
            <div className="role-icon">🏢</div>
            <div className="role-info">
              <h3>Empresa</h3>
              <p>Dashboard analítico y gestión de negocio</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h3>
            {isLogin ? "Acceder" : "Registrarse"} como{" "}
            {activeRole === "customer" ? "Cliente" : "Empresa"}
          </h3>

          {!isLogin && (
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required={!isLogin}
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {!isLogin && activeRole === "business" && (
            <div className="form-group">
              <label>Nombre de la Empresa</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Cargando..." : isLogin ? "Acceder" : "Registrarse"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPortal;
