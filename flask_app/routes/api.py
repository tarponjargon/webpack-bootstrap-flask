from flask import Blueprint
from flask_app.petfinder import PetFinder

api = Blueprint("api", __name__, url_prefix="/api")


@api.route("/contact", methods=["GET", "POST"])
def do_contact():
    return {"success": True}


@api.route("/puppies")
def puppies():
    params = {
        "type": "dog",
        "sort": "random",
    }
    petfinder = PetFinder()
    return petfinder.get_puppies(params)


@api.route("/puppy/<int:id>")
def puppy(id):
    petfinder = PetFinder()
    result = petfinder.get_puppy(id)
    return result["animal"]
