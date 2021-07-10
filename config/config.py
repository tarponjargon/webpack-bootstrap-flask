""" flask app configuration """

class Config(object):
  """ config vars common to all environments """
  STORE_EMAIL = "letspetpuppies@yahoo.com"
  STORE_NAME = "Let's Pet Puppies!"
  STORE_ADDRESS1 = "1234 Puppy St"
  STORE_CITY = "Puppytown"
  STORE_STATE = "PA"
  STORE_ZIP = "123456"
  STORE_PHONE = "1-800-PUPPIES"


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