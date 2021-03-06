import os


class Config(object):
    """config vars common to all Flask app environments"""

    STORE_EMAIL = "letspetpuppies@puppies.com"
    STORE_NAME = "Let's Pet Puppies!"
    STORE_ADDRESS1 = "1234 Puppy St"
    STORE_CITY = "Puppytown"
    STORE_STATE = "PA"
    STORE_ZIP = "123456"
    STORE_PHONE = "1-800-PUPPIES"

    DEFAULT_IMAGE = "/assets/images/puppy.jpg"

    # get a petfinder api key https://www.petfinder.com/developers/ and replace
    # the data below
    PETFINDER_API = "https://api.petfinder.com/v2"
    PETFINDER_API_KEY = "LnySsmsuj1B2hOl9q3Rvnpm9CHyUzO56LyqVVZnQVqjPHRPafh"
    PETFINDER_API_SECRET = "Zr0RRL6Ot56kP2SQdzKRpX80q7kIWtiDwd61Rlfa"


class development(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = f"{os.environ.get('DEV_URL') or 'http://localhost:8080'}"


class staging(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = "https://puppies.thewhiteroom.com"


class production(Config):
    DEVELOPMENT = True
    DEBUG = True
    STORE_URL = "https://puppies.production-url.com"
