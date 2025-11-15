import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
	const { user } = useAuth();

	return (
		<div className="home-container">
			<section className="hero-section">
				<div className="hero-content">
					<h1>EcoLuxury Craft</h1>
					<p className="hero-subtitle">
						Lujo Sostenible Inteligente - Donde la Elegancia se Encuentra con la Ecología
					</p>
					<p className="hero-description">
						Descubre nuestra exclusiva colección de yates solares, jets ecológicos
						y autos de lujo eléctricos. Cada producto es una obra maestra de
						ingeniería sostenible y diseño personalizado.
					</p>
					<div className="hero-actions">
						<Link to="/products" className="btn btn-primary btn-large">
							Explorar Productos
						</Link>
						{!user && (
							<Link to="/login" className="btn btn-secondary btn-large">
								Iniciar Sesión
							</Link>
						)}
					</div>
				</div>
			</section>

			<section className="features-section">
				<div className="container">
					<h2>¿Por Qué Elegir EcoLuxury?</h2>
					<div className="features-grid">
						<div className="feature-item">
							<div className="feature-icon">🌱</div>
							<h3>Sostenibilidad Total</h3>
							<p>Productos 100% ecológicos con cero emisiones y materiales renovables</p>
						</div>
						<div className="feature-item">
							<div className="feature-icon">🎨</div>
							<h3>Personalización Avanzada</h3>
							<p>Diseña cada detalle según tus preferencias y necesidades específicas</p>
						</div>
						<div className="feature-item">
							<div className="feature-icon">⚡</div>
							<h3>Tecnología de Vanguardia</h3>
							<p>Incorporamos las últimas innovaciones en energía solar y eléctrica</p>
						</div>
						<div className="feature-item">
							<div className="feature-icon">🌟</div>
							<h3>Calidad Premium</h3>
							<p>Artesanía excepcional y materiales de la más alta calidad</p>
						</div>
					</div>
				</div>
			</section>

			<section className="categories-section">
				<div className="container">
					<h2>Nuestras Categorías Exclusivas</h2>
					<div className="categories-grid">
						<Link to="/products?category=yacht" className="category-card">
							<div className="category-icon">⛵</div>
							<h3>Yates Solares</h3>
							<p>Navega en lujo absoluto con energía 100% renovable</p>
							<span className="explore-link">Explorar →</span>
						</Link>
						<Link to="/products?category=private_jet" className="category-card">
							<div className="category-icon">✈️</div>
							<h3>Jets Ecológicos</h3>
							<p>Viaja sin huella de carbono con nuestra flota de jets sostenibles</p>
							<span className="explore-link">Explorar →</span>
						</Link>
						<Link to="/products?category=luxury_car" className="category-card">
							<div className="category-icon">🚗</div>
							<h3>Autos Eléctricos</h3>
							<p>Elegancia y potencia en movilidad completamente eléctrica</p>
							<span className="explore-link">Explorar →</span>
						</Link>
					</div>
				</div>
			</section>

			<section className="cta-section">
				<div className="container">
					<h2>¿Listo para Experimentar el Lujo Sostenible?</h2>
					<p>Únete a la revolución del lujo inteligente y ecológico</p>
					<div className="cta-actions">
						<Link to="/products" className="btn btn-primary btn-large">
							Comenzar a Personalizar
						</Link>
						{!user && (
							<Link to="/login" className="btn btn-secondary btn-large">
								Crear Cuenta
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;