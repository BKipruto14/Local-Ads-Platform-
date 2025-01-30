from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from app.models import User

auth_routes = Blueprint("auth_routes", __name__)

# ✅ User Registration Route
@auth_routes.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing fields"}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    # Hash the password for security
    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")

    # Create new user
    new_user = User(name=data["name"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

# ✅ User Login Route
@auth_routes.route("/api/login", methods=["POST"])
def login():
    data = request.json
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not  user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT Token
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Login successful", "token": access_token}), 200