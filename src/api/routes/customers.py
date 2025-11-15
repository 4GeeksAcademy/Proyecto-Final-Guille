from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, CustomerProfile

customers_bp = Blueprint('customers', __name__)

# PUT /customer/profile - Actualizar perfil de cliente


@customers_bp.route('/customer/profile', methods=['PUT'])
@jwt_required()
def update_customer_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403

        data = request.get_json()
        profile = user.customer_profile

        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        # Campos actualizables
        if 'first_name' in data:
            profile.first_name = data['first_name']
        if 'last_name' in data:
            profile.last_name = data['last_name']
        if 'phone' in data:
            profile.phone = data['phone']
        if 'address' in data:
            profile.address = data['address']

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'first_name': profile.first_name,
                'last_name': profile.last_name,
                'phone': profile.phone,
                'address': profile.address
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE /customer/profile - Eliminar cuenta de cliente


@customers_bp.route('/customer/profile', methods=['DELETE'])
@jwt_required()
def delete_customer_account():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403

        # Soft delete - marcar como inactivo
        user.is_active = False
        db.session.commit()

        return jsonify({'message': 'Account deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
