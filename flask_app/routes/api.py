from flask import Blueprint, jsonify, current_app

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/contact", methods=["GET", "POST"])
def do_contact():
    """returns ALL addresses"""
    return {"success": True}
