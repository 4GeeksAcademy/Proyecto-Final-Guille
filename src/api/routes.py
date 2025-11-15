from .routes.products import setup_products_routes
from .routes.quotes import setup_quotes_routes
from .routes.customers import setup_customers_routes
from .routes.business import setup_business_routes
from .routes.analytics import setup_analytics_routes

api = Blueprint('api', __name__)


def setup_routes(app):
    # Registrar todas las rutas
    setup_products_routes(app)
    setup_quotes_routes(app)
    setup_customers_routes(app)
    setup_business_routes(app)
    setup_analytics_routes(app)


# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
