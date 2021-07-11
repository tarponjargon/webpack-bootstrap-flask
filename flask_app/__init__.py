import os
import logging
from flask_compress import Compress
from flask import Flask, render_template
from flask_app.helpers import page_not_found, add_security_headers
from flask_app.routes.views import views
from flask_app.routes.api import api

compress = Compress()

app = Flask(__name__, static_folder="assets")
app.config.from_object("config." + "config." + os.environ["ENV"])
app.register_error_handler(404, page_not_found)
gunicorn_logger = logging.getLogger("gunicorn.error")
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)
compress.init_app(app)

# routes
app.register_blueprint(views)
app.register_blueprint(api)


@app.after_request
def security(response):
    return add_security_headers(response)
