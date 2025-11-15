from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Quote, Product, BusinessAnalytics
from sqlalchemy import func, extract
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

# GET /analytics/business - Dashboard para empresas


@analytics_bp.route('/analytics/business', methods=['GET'])
@jwt_required()
def get_business_analytics():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'business':
            return jsonify({'error': 'Business access required'}), 403

        # Métricas básicas de negocio
        total_revenue = db.session.query(func.sum(Quote.total_price)).filter(
            Quote.status == 'approved'
        ).scalar() or 0

        active_quotes = Quote.query.filter(
            Quote.status.in_(['draft', 'submitted'])
        ).count()

        # Métricas de sostenibilidad
        total_co2_saved = db.session.query(func.sum(Quote.co2_savings)).filter(
            Quote.status == 'approved'
        ).scalar() or 0

        total_solar_power = db.session.query(func.sum(Product.solar_power)).filter(
            Product.is_active == True
        ).scalar() or 0

        # Ventas por categoría
        sales_by_category = db.session.query(
            Product.category,
            func.count(Quote.id),
            func.sum(Quote.total_price)
        ).join(Quote).filter(
            Quote.status == 'approved'
        ).group_by(Product.category).all()

        # Tendencias mensuales
        monthly_trends = get_monthly_trends()

        analytics_data = {
            'kpis': {
                'total_revenue': total_revenue,
                'active_quotes': active_quotes,
                'total_co2_saved': total_co2_saved,
                'total_solar_power': total_solar_power,
                'conversion_rate': calculate_conversion_rate()
            },
            'sales_by_category': [
                {
                    'category': category,
                    'quote_count': count,
                    'revenue': revenue
                } for category, count, revenue in sales_by_category
            ],
            'monthly_trends': monthly_trends,
            'top_products': get_top_products(),
            'sustainability_impact': get_sustainability_impact()
        }

        # Guardar analytics para histórico
        save_business_analytics(user_id, analytics_data)

        return jsonify(analytics_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET /analytics/customer - Analytics para cliente


@analytics_bp.route('/analytics/customer', methods=['GET'])
@jwt_required()
def get_customer_analytics():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403

        # Cotizaciones del usuario
        user_quotes = Quote.query.filter_by(user_id=user_id).all()

        total_co2_saved = sum(quote.co2_savings for quote in user_quotes)
        total_investment = sum(
            quote.total_price for quote in user_quotes if quote.status == 'approved')

        # Impacto personalizado
        trees_equivalent = total_co2_saved * 0.05  # Aproximación
        equivalent_cars = total_co2_saved / 2.4  # Promedio anual por coche

        return jsonify({
            'personal_impact': {
                'total_co2_saved': total_co2_saved,
                'trees_equivalent': trees_equivalent,
                'equivalent_cars': equivalent_cars,
                'total_investment': total_investment
            },
            'quote_history': [
                {
                    'product_name': quote.product.name,
                    'sustainability_score': quote.sustainability_score,
                    'date': quote.created_at.isoformat(),
                    'status': quote.status
                } for quote in user_quotes
            ]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Funciones auxiliares


def calculate_conversion_rate():
    total_quotes = Quote.query.count()
    approved_quotes = Quote.query.filter_by(status='approved').count()

    return (approved_quotes / total_quotes * 100) if total_quotes > 0 else 0


def get_monthly_trends():
    # Últimos 6 meses
    six_months_ago = datetime.now() - timedelta(days=180)

    monthly_data = db.session.query(
        extract('year', Quote.created_at).label('year'),
        extract('month', Quote.created_at).label('month'),
        func.count(Quote.id).label('quote_count'),
        func.sum(Quote.total_price).label('revenue')
    ).filter(
        Quote.created_at >= six_months_ago,
        Quote.status == 'approved'
    ).group_by('year', 'month').order_by('year', 'month').all()

    return [
        {
            'period': f"{int(month)}/{int(year)}",
            'quotes': count,
            'revenue': revenue or 0
        } for year, month, count, revenue in monthly_data
    ]


def get_top_products():
    return db.session.query(
        Product.name,
        func.count(Quote.id).label('popularity')
    ).join(Quote).group_by(Product.id).order_by(
        func.count(Quote.id).desc()
    ).limit(5).all()


def get_sustainability_impact():
    total_quotes = Quote.query.count()
    high_sustainability_quotes = Quote.query.filter(
        Quote.sustainability_score >= 150
    ).count()

    return {
        'sustainability_adoption_rate': (high_sustainability_quotes / total_quotes * 100) if total_quotes > 0 else 0,
        'avg_sustainability_score': db.session.query(func.avg(Quote.sustainability_score)).scalar() or 0
    }


def save_business_analytics(business_id, data):
    analytics = BusinessAnalytics(
        business_id=business_id,
        total_revenue=data['kpis']['total_revenue'],
        active_quotes=data['kpis']['active_quotes'],
        conversion_rate=data['kpis']['conversion_rate'],
        total_co2_saved=data['kpis']['total_co2_saved'],
        total_solar_power=data['kpis']['total_solar_power']
    )

    db.session.add(analytics)
    db.session.commit()
