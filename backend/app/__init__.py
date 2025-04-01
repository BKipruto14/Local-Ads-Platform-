from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)
    
    # Configure database and JWT
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///classified_ads.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change this in production


    CORS(app, 
     resources = {r"/api/*": {"origins": "http://localhost:3001"}},  
     supports_credentials=True,
     allow_headers=["Content-Type","Authorization"])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Import models to ensure they're registered
    from app.models import User, Ad, Message
    
    with app.app_context():
        db.create_all()
        
    @app.route('/')
    
    def home():
        return "Welcome to the IPK Ads Platform!"
    
    # Import Blueprints from the `routes/` folder
    from app.routes.routes import user_bp  
    from app.routes.auth import auth_routes  
    from app.routes.ad import ad_routes  

    # Register Blueprints with URL prefixes
    app.register_blueprint(user_bp, url_prefix="/api/routes")
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(ad_routes, url_prefix="/api/ad")

    return app
