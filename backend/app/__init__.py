from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///classified_ads.db'
    app.config['JWT_SECRET_KEY'] = 'supersecretkey'
    
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
 
    @app.route('/')
    def home():
        return "Welcome to the Local Ads Platform!"
    
    return app