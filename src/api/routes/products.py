from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Product, User

products_bp = Blueprint('products', __name__)

# GET /products - Lista todos los productos activos


@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.filter_by(is_active=True).all()

        return jsonify([{
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'base_price': product.base_price,
            'category': product.category,
            'type': product.type,
            'co2_savings': product.co2_savings,
            'solar_power': product.solar_power,
            'energy_efficiency': product.energy_efficiency,
            'image_url': product.image_url
        } for product in products]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET /products/<product_id> - Detalle de producto


@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)

        if not product or not product.is_active:
            return jsonify({'error': 'Product not found'}), 404

        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'base_price': product.base_price,
            'category': product.category,
            'type': product.type,
            'co2_savings': product.co2_savings,
            'solar_power': product.solar_power,
            'energy_efficiency': product.energy_efficiency,
            'image_url': product.image_url,
            'specs_document': product.specs_document
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# POST /products - Crear producto (solo admin/business)


@products_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role not in ['business', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403

        data = request.get_json()

        # Validaciones
        required_fields = ['name', 'base_price', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            base_price=float(data['base_price']),
            category=data['category'],
            type=data.get('type', 'configurable'),
            co2_savings=float(data.get('co2_savings', 0)),
            solar_power=float(data.get('solar_power', 0)),
            energy_efficiency=data.get('energy_efficiency', ''),
            image_url=data.get('image_url', '')
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            'message': 'Product created successfully',
            'product': {
                'id': product.id,
                'name': product.name,
                'base_price': product.base_price
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# PUT /products/<product_id> - Actualizar producto


@products_bp.route('/products/<product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role not in ['business', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        data = request.get_json()

        # Campos actualizables
        updatable_fields = ['name', 'description', 'base_price', 'category',
                            'co2_savings', 'solar_power', 'energy_efficiency', 'image_url']

        for field in updatable_fields:
            if field in data:
                setattr(product, field, data[field])

        db.session.commit()

        return jsonify({'message': 'Product updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE /products/<product_id> - Eliminar producto (soft delete)


@products_bp.route('/products/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role not in ['business', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        product.is_active = False
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
