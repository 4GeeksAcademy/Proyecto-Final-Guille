from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()


def generate_uuid():
    return str(uuid.uuid4())


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False,
                     default='customer')  # customer, business, admin
    is_active = db.Column(db.Boolean(), default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones condicionales
    customer_profile = db.relationship(
        'CustomerProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    business_profile = db.relationship(
        'BusinessProfile', backref='user', uselist=False, cascade='all, delete-orphan')


class CustomerProfile(db.Model):
    __tablename__ = 'customer_profiles'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey(
        'users.id'), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)

    # Métricas de sostenibilidad personal
    total_co2_saved = db.Column(db.Float, default=0.0)  # en toneladas
    trees_equivalent = db.Column(db.Float, default=0.0)

    # Relaciones
    quotes = db.relationship('Quote', backref='customer', lazy=True)


class BusinessProfile(db.Model):
    __tablename__ = 'business_profiles'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey(
        'users.id'), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    tax_id = db.Column(db.String(50))
    contact_person = db.Column(db.String(100))
    business_type = db.Column(db.String(100))
    company_size = db.Column(db.String(50))


class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    base_price = db.Column(db.Float, nullable=False)
    # solar_yacht, eco_jet, sustainable_resort
    category = db.Column(db.String(100), nullable=False)
    # configurable, direct
    type = db.Column(db.String(50), default='configurable')
    stock = db.Column(db.Integer, default=1)  # Para productos directos

    # Especificaciones sostenibles
    # toneladas CO2 ahorradas vs tradicional
    co2_savings = db.Column(db.Float, default=0.0)
    solar_power = db.Column(db.Float, default=0.0)  # kWp
    energy_efficiency = db.Column(db.String(50))

    # Imágenes y multimedia
    image_url = db.Column(db.String(500))
    specs_document = db.Column(db.String(500))

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Quote(db.Model):
    __tablename__ = 'quotes'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey(
        'users.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey(
        'products.id'), nullable=False)

    # Configuración personalizada (JSON)
    configuration = db.Column(db.JSON)

    # Métricas calculadas
    total_price = db.Column(db.Float, nullable=False)
    co2_savings = db.Column(db.Float, default=0.0)
    sustainability_score = db.Column(db.Integer, default=0)

    # Estado
    # draft, submitted, approved, rejected
    status = db.Column(db.String(50), default='draft')
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    product = db.relationship('Product', backref='quotes')


class BusinessAnalytics(db.Model):
    __tablename__ = 'business_analytics'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    business_id = db.Column(
        db.String(36), db.ForeignKey('users.id'), nullable=False)

    # Métricas de negocio
    total_revenue = db.Column(db.Float, default=0.0)
    active_quotes = db.Column(db.Integer, default=0)
    conversion_rate = db.Column(db.Float, default=0.0)

    # Métricas de sostenibilidad
    total_co2_saved = db.Column(db.Float, default=0.0)
    total_solar_power = db.Column(db.Float, default=0.0)

    # Timestamp
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación
    business = db.relationship('User', backref='analytics')
