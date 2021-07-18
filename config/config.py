""" flask app configuration """


class Config(object):
    """config vars common to all environments"""

    STORE_EMAIL = "letspetpuppies@yahoo.com"
    STORE_NAME = "Let's Pet Puppies!"
    STORE_ADDRESS1 = "1234 Puppy St"
    STORE_CITY = "Puppytown"
    STORE_STATE = "PA"
    STORE_ZIP = "123456"
    STORE_PHONE = "1-800-PUPPIES"

    DEFAULT_IMAGE = "/assets/images/puppy.jpg"

    # might need to get your own
    PETFINDER_API = "https://api.petfinder.com/v2"
    PETFINDER_API_KEY = "cOPI6mxazHTvCgQ2BZWh2grAbYo6JWJem8sY7QzXhNoOMiddlB"
    PETFINDER_API_SECRET = "1lrnjYy4v6O74Lhd2z9YIqN015DsALxpYf9FkS4M"


class development(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = "http://localhost:8080"


class staging(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = "http://localhost:8080"


class production(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = "http://localhost:8080"
