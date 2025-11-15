from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Quote, Product, User, CustomerProfile
import json

quotes_bp = Blueprint('quotes', __name__)

# POST /quotes - Crear nueva cotización


@quotes_bp.route('/quotes', methods=['POST'])
@jwt_required()
def create_quote():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validar producto
        product = Product.query.get(data.get('product_id'))
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Calcular precio total basado en configuración
        base_price = product.base_price
        configuration = data.get('configuration', {})
        additional_cost = calculate_additional_cost(configuration)
        total_price = base_price + additional_cost

        # Calcular métricas de sostenibilidad
        co2_savings = calculate_co2_savings(product, configuration)
        sustainability_score = calculate_sustainability_score(configuration)

        quote = Quote(
            user_id=user_id,
            product_id=product.id,
            configuration=configuration,
            total_price=total_price,
            co2_savings=co2_savings,
            sustainability_score=sustainability_score
        )

        db.session.add(quote)
        db.session.commit()

        return jsonify({
            'message': 'Quote created successfully',
            'quote': {
                'id': quote.id,
                'total_price': quote.total_price,
                'co2_savings': quote.co2_savings,
                'sustainability_score': quote.sustainability_score
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GET /quotes - Listar cotizaciones del usuario


@quotes_bp.route('/quotes', methods=['GET'])
@jwt_required()
def get_user_quotes():
    try:
        user_id = get_jwt_identity()
        quotes = Quote.query.filter_by(user_id=user_id).order_by(
            Quote.created_at.desc()).all()

        return jsonify([{
            'id': quote.id,
            'product_name': quote.product.name,
            'total_price': quote.total_price,
            'co2_savings': quote.co2_savings,
            'sustainability_score': quote.sustainability_score,
            'status': quote.status,
            'created_at': quote.created_at.isoformat()
        } for quote in quotes]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Funciones auxiliares


def calculate_additional_cost(configuration):
    """Calcula coste adicional basado en la configuración"""
    additional_cost = 0

    # Lógica de cálculo de costes adicionales
    if configuration.get('solar_system') == 'premium':
        additional_cost += 120000
    if configuration.get('battery_system') == 'extended':
        additional_cost += 80000
    if configuration.get('materials') == 'premium_eco':
        additional_cost += 150000

    return additional_cost


def calculate_co2_savings(product, configuration):
    """Calcula ahorro de CO2 basado en producto y configuración"""
    base_savings = product.co2_savings

    # Bonus por configuración ecológica
    eco_bonus = 0
    if configuration.get('solar_system'):
        eco_bonus += 15
    if configuration.get('eco_materials'):
        eco_bonus += 10

    return base_savings + eco_bonus


def calculate_sustainability_score(configuration):
    """Calcula puntuación de sostenibilidad"""
    score = 100  # Base

    # Bonus por opciones ecológicas
    if configuration.get('solar_system') == 'premium':
        score += 25
    if configuration.get('battery_system') == 'extended':
        score += 20
    if configuration.get('materials') == 'premium_eco':
        score += 30

    return min(score, 200)  # Máximo 200%
