import html
from flask import Blueprint, render_template, current_app, request
from flask_app.petfinder import PetFinder
from flask_app.helpers import safe_param, get_qs, make_qs, page_not_found

views = Blueprint("views", __name__)


@views.context_processor
def template_utils():
    """template functions"""

    def qs(params, exclude=None):
        """make a query string from a dict inside a template"""
        return make_qs(params, exclude)

    return dict(qs=qs)


@views.route("/")
def home():
    petfinder = PetFinder()
    data = petfinder.get_features()
    babies = [
        i for i in data if "primary_photo_cropped" in i and i["primary_photo_cropped"] and i["status"] == "adoptable"
    ]  # only objects with images
    return render_template("home.html.j2", features=babies)


@views.route("/puppies")
def puppies():
    params = {
        "type": "dog",
        "sort": "random",
        "page": safe_param("page"),
        "location": safe_param("location"),
        "breed": safe_param("breed"),
        "size": safe_param("size"),
    }
    petfinder = PetFinder()
    results = petfinder.get_puppies(params)

    # modify petfinder's pagination links rather than hand-rolling
    prev_url = None
    next_url = None
    try:
        prev_url = request.path + "?" + get_qs(results["pagination"]["_links"]["previous"]["href"])
    except KeyError:
        pass
    try:
        next_url = request.path + "?" + get_qs(results["pagination"]["_links"]["next"]["href"])
    except KeyError:
        pass

    return render_template(
        "puppies.html.j2", puppies=results["animals"], params=params, prev_url=prev_url, next_url=next_url
    )


@views.route("/puppy/<int:id>")
def puppy(id):
    petfinder = PetFinder()
    result = petfinder.get_puppy(id)
    if result and "animal" in result:
        # petfinder sends entities back in the description
        if "description" in result["animal"] and isinstance(result["animal"]["description"], str):
            result["animal"]["description"] = html.unescape(result["animal"]["description"])
        return render_template("puppy.html.j2", puppy=result["animal"])
    else:
        return page_not_found()


@views.route("/favorites")
def favorites():
    return render_template("favorites.html.j2")


@views.route("/about")
def about():
    return render_template("about.html.j2")


@views.route("/contact")
def contact():
    return render_template("contact.html.j2")
