from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)

    # Configure database and JWT
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///classified_ads.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change this in production

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # Import models to ensure they're registered
    from app.models import User, Ad, Message

    @app.route('/')
    def home():
        return "Welcome to the Local Ads Platform!"

    # ✅ Import Blueprints from the `routes/` folder
    from app.routes.routes import user_bp  
    from app.routes.auth import auth_routes  
    from app.routes.ad import ad_routes  

    # ✅ Register Blueprints with URL prefixes
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(ad_routes, url_prefix="/api/ads")

    return app
