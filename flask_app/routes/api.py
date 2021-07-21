from flask import Blueprint, jsonify, current_app
from flask_app.petfinder import PetFinder

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/contact", methods=["GET", "POST"])
def do_contact():
    return {"success": True}


@api.route("/puppy/<int:id>")
def puppy(id):
    petfinder = PetFinder()
    result = petfinder.get_puppy(id)
    return result["animal"]
