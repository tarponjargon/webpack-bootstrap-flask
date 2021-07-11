from flask import Blueprint, render_template, current_app
from flask_app.petfinder import PetFinder

views = Blueprint("views", __name__)


@views.route("/")
def home():
    petfinder = PetFinder()
    pets = petfinder.get_pets()
    current_app.logger.warning(pets)
    return render_template("home.html.j2")


@views.route("/about")
def about():
    return render_template("about.html.j2")


@views.route("/contact")
def contact():
    return render_template("contact.html.j2")
