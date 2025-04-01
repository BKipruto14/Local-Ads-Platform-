from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Ad

ad_routes = Blueprint("ad_routes", __name__)

# Protected: Create an Ad (Requires JWT)
@ad_routes.route("/create_ads", methods=["POST"])
@jwt_required()
def create_ad():
    data = request.json
    user_id = get_jwt_identity()  # Get user ID from JWT token

    if not data.get("title") or not data.get("description") or not data.get("price"):
        return jsonify({"error": "Missing required fields"}), 400

    new_ad = Ad(
        title=data["title"],
        description=data["description"],
        price=data["price"],
        seller_id=user_id,
        status="available"
    )
    db.session.add(new_ad)
    db.session.commit()

    return jsonify({"message": "Ad posted successfully!"}), 201

# Public: View All Ads
@ad_routes.route("/view_ads", methods=["GET"])
def get_ads():
    ads = Ad.query.all()
    ads_list = [
        {
            "id": ad.id,
            "title": ad.title,
            "description": ad.description,
            "price": ad.price,
            "seller_id": ad.seller_id,
            "status": ad.status
        }
        for ad in ads
    ]
    return jsonify({"ads": ads_list}), 200

#Edit ad
@ad_routes.route("/<int:ad_id>", methods=["PUT"]) 
@jwt_required()
def edit_ad(ad_id):
    user_id = get_jwt_identity()  # Get logged-in user ID
    ad = Ad.query.get(ad_id)

    if not ad:
        return jsonify({"error": "Ad not found"}), 404

    # Ensure only the seller can edit the ad
    if ad.seller_id != int(user_id):
        return jsonify({"error": "Unauthorized to edit this ad"}), 403

    data = request.json
    if data.get("title"):
        ad.title = data["title"]
    if data.get("description"):
        ad.description = data["description"]
    if data.get("price"):
        ad.price = data["price"]
    if data.get("status"):
        ad.status = data["status"]  # e.g., "available", "sold"

    db.session.commit()
    return jsonify({"message": "Ad updated successfully!"}), 200

#Delete ad
@ad_routes.route("/delete_ads", methods=["DELETE"])
@jwt_required()
def delete_ad(ad_id):
    user_id = get_jwt_identity()  # Get logged-in user ID
    ad = Ad.query.get(ad_id)

    if not ad:
        return jsonify({"error": "Ad not found"}), 404

    # Ensure only the seller can delete the ad
    if ad.seller_id != int(user_id):
        return jsonify({"error": "Unauthorized to delete this ad"}), 403

    db.session.delete(ad)
    db.session.commit()

    return jsonify({"message": "Ad deleted successfully!"}), 200

#Get Ads created by a user
@ad_routes.route("/my-ads", methods=["GET"])
@jwt_required()
def get_my_ads():
    user_id = get_jwt_identity()  # Get logged-in user ID
    user_ads = Ad.query.filter_by(seller_id=user_id).all()

    ads_list = [
        {
            "id": ad.id,
            "title": ad.title,
            "description": ad.description,
            "price": ad.price,
            "status": ad.status
        }
        for ad in user_ads
    ]

    return jsonify({"my_ads": ads_list}), 200

