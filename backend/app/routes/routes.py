from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app import db

# Create Blueprint for user routes
user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    """Fetches the currently logged-in user's details"""
    try:
     user_id = get_jwt_identity()
     user = User.query.get(user_id)

     if not user:
         return jsonify({"error": "User not found"}), 404
  
     return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email
     }), 200
    except Exception as e :
        print (f"Error: {str(e)}")
        return jsonify({"error": "Error while fetching user data"}), 500
        


@user_bp.route("/update", methods=["PUT"])  # route and method
@jwt_required()
def update_user():
    """Allows a user to update their profile (name & email)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get JSON data from request
    data = request.json
    user.name = data.get("name", user.name)  # Update name if provided
    user.email = data.get("email", user.email)  # Update email if provided

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

