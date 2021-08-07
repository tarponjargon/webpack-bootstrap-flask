""" gunicorn webserver configuration """

import os
from glob import glob

workers = os.environ.get("GUNICORN_WORKERS") or 1
threads = os.environ.get("GUNICORN_THREADS") or 3
bind = "localhost:" + os.environ.get("FLASK_PORT") or 5000
reload = True
reload_extra_files = glob("flask_app/templates/**/*", recursive=True)
errorlog = "logs/gunicorn-error.log"
accesslog = "logs/gunicorn-access.log"
pidfile = "tmp/gunicorn.pid"
loglevel = "debug"
