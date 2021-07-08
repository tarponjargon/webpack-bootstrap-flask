from flask import Flask, render_template

app = Flask(__name__, static_folder = 'assets')

@app.route("/")
def home():
    return render_template("home.html.j2")

@app.route("/about")
def about():
    return render_template("about.html.j2")

@app.route("/contact")
def contact():
    return render_template("contact.html.j2")

