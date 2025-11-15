from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, CustomerProfile, BusinessProfile
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validaciones básicas
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        # Crear usuario
        user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),
            role=data.get('role', 'customer')
        )

        db.session.add(user)
        db.session.flush()  # Para obtener el ID

        # Crear perfil según el rol
        if user.role == 'customer':
            profile = CustomerProfile(
                user_id=user.id,
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', '')
            )
        elif user.role == 'business':
            profile = BusinessProfile(
                user_id=user.id,
                company_name=data.get('company_name', ''),
                contact_person=data.get('contact_person', '')
            )
        else:
            return jsonify({'error': 'Invalid role'}), 400

        db.session.add(profile)
        db.session.commit()

        # Token de acceso
        access_token = create_access_token(identity=user.id)

        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        user = User.query.filter_by(email=data.get('email')).first()

        if not user or not check_password_hash(user.password, data.get('password', '')):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=user.id)

        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        profile_data = {
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        }

        # Añadir datos específicos del perfil
        if user.role == 'customer' and user.customer_profile:
            profile_data.update({
                'first_name': user.customer_profile.first_name,
                'last_name': user.customer_profile.last_name,
                'phone': user.customer_profile.phone,
                'total_co2_saved': user.customer_profile.total_co2_saved,
                'trees_equivalent': user.customer_profile.trees_equivalent
            })
        elif user.role == 'business' and user.business_profile:
            profile_data.update({
                'company_name': user.business_profile.company_name,
                'contact_person': user.business_profile.contact_person,
                'business_type': user.business_profile.business_type
            })

        return jsonify(profile_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
