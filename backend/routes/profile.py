
# routes/profile.py

from flask import Blueprint, jsonify
from auth import token_required

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/me", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email if hasattr(current_user, "email") else None
    })
