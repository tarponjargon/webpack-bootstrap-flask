""" flask webserver configuration """

from glob import glob

workers = 1
threads = 3
bind = "localhost:8000"
reload = True
reload_extra_files = glob("flask_app/templates/**/*", recursive=True)
errorlog="logs/gunicorn-error.log"
accesslog="logs/gunicorn-access.log"
loglevel = "debug"
