from flask_app.helpers import safe_field, validate_email, validate_phone
from flask import Blueprint, current_app, request
from flask_app.petfinder import PetFinder

api = Blueprint("api", __name__, url_prefix="/api")


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


@api.route("/contact", methods=["POST"])
def contact():
    r = {"success": False, "message": None}
    name = safe_field("name")
    email = safe_field("email")
    phone = safe_field("phone")
    message = safe_field("message")
    current_app.logger.debug(request.form)
    if not name:
        r["message"] = "Please enter a name"
    elif not validate_email(email):
        r["message"] = "Please check your e-mail format"
    elif not validate_phone(phone):
        r["message"] = "Please enter a valid phone in the format 555-555-5555"
    elif not message:
        r["message"] = "Please enter a message"
    else:
        r["success"] = True
    return r
