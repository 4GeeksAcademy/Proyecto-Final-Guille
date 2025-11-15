from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Quote, Product

business_bp = Blueprint('business', __name__)

# GET /business/quotes - Todas las cotizaciones (para empresas)


@business_bp.route('/business/quotes', methods=['GET'])
@jwt_required()
def get_all_quotes():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'business':
            return jsonify({'error': 'Business access required'}), 403

        quotes = Quote.query.order_by(Quote.created_at.desc()).all()

        return jsonify([{
            'id': quote.id,
            'customer_name': f"{quote.customer.first_name} {quote.customer.last_name}",
            'customer_email': quote.user.email,
            'product_name': quote.product.name,
            'total_price': quote.total_price,
            'sustainability_score': quote.sustainability_score,
            'status': quote.status,
            'created_at': quote.created_at.isoformat()
        } for quote in quotes]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# PUT /business/quotes/<quote_id> - Actualizar estado de cotización


@business_bp.route('/business/quotes/<quote_id>', methods=['PUT'])
@jwt_required()
def update_quote_status(quote_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'business':
            return jsonify({'error': 'Business access required'}), 403

        quote = Quote.query.get(quote_id)
        if not quote:
            return jsonify({'error': 'Quote not found'}), 404

        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ['draft', 'submitted', 'approved', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400

        quote.status = new_status
        quote.notes = data.get('notes', '')

        db.session.commit()

        return jsonify({'message': 'Quote status updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GET /business/customers - Lista de clientes


@business_bp.route('/business/customers', methods=['GET'])
@jwt_required()
def get_business_customers():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'business':
            return jsonify({'error': 'Business access required'}), 403

        customers = User.query.filter_by(
            role='customer').join(User.customer_profile).all()

        return jsonify([{
            'id': customer.id,
            'name': f"{customer.customer_profile.first_name} {customer.customer_profile.last_name}",
            'email': customer.email,
            'total_quotes': len(customer.quotes),
            'total_co2_saved': customer.customer_profile.total_co2_saved,
            'joined_date': customer.created_at.isoformat()
        } for customer in customers]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
