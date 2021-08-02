""" gunicorn webserver configuration """

import os
from glob import glob

workers = 1
threads = 3
bind = "localhost:" + os.environ["FLASK_PORT"] or 5000
reload = True
reload_extra_files = glob("flask_app/templates/**/*", recursive=True)
errorlog = "logs/gunicorn-error.log"
accesslog = "logs/gunicorn-access.log"
loglevel = "debug"
