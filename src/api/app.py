# api/app.py
import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from api.models import db


def create_app():
    app = Flask(__name__)

    # Configuración
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL', 'sqlite:///luxury_eco.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get(
        'JWT_SECRET_KEY', 'super-secret-key')

    # Inicializar extensiones
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app)

    # Registrar blueprints
    from api.routes.auth import auth_bp
    from api.routes.products import products_bp
    from api.routes.quotes import quotes_bp
    from api.routes.analytics import analytics_bp
    from api.routes.business import business_bp
    from api.routes.customers import customers_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(quotes_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    app.register_blueprint(business_bp, url_prefix='/api')
    app.register_blueprint(customers_bp, url_prefix='/api')

    # Ruta de salud
    @app.route('/')
    def health_check():
        return jsonify({
            'message': 'Luxury Eco Configurator API',
            'status': 'healthy'
        })

    # Crear tablas
    with app.app_context():
        db.create_all()

    return app


# ESTO ES CRÍTICO - debe estar al final
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=3001, debug=True)
