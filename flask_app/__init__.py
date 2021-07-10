import os
from flask import Flask, render_template

def page_not_found(e):
    return render_template("404.html.j2"), 404

app = Flask(__name__, static_folder = 'assets')
app.config.from_object("config." + "config." + os.environ["ENV"])
app.register_error_handler(404, page_not_found)

@app.route("/")
def home():
    return render_template("home.html.j2")

@app.route("/about")
def about():
    return render_template("about.html.j2")

@app.route("/contact")
def contact():
    return render_template("contact.html.j2")

