from flask import Blueprint, render_template, current_app
from flask_app.petfinder import PetFinder

views = Blueprint("views", __name__)


@views.route("/")
def home():
    return render_template("home.html.j2")


@views.route("/puppies")
def puppies():
    petfinder = PetFinder()
    puppies = petfinder.get_puppies()
    current_app.logger.warning(puppies)
    return render_template("puppies.html.j2", puppies=puppies)


@views.route("/about")
def about():
    return render_template("about.html.j2")


@views.route("/contact")
def contact():
    return render_template("contact.html.j2")
