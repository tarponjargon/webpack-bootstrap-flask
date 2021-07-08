import sys
import os
from flask_app import app

environment = os.getenv('ENV')
dir_path = os.path.dirname(os.path.realpath(__file__))

activate_this = dir_path + '/virtualenv_python/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/flask_app')

if __name__ == "__main__":
    app.run()