from .routes import setup_routes
from .models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, request, jsonify
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ.get(
    'JWT_SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 'sqlite:///luxury_store.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensiones
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Configurar rutas
setup_routes(app)


@app.route('/')
def hello_world():
    return jsonify({"message": "EcoLuxury Craft API is running!"})


# Esto es importante para Flask
application = app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
