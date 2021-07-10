import requests
import time
from pprint import pprint
from flask import current_app

class PetApi:
    url = None
    key = None
    secret = None
    access_token = None
    access_token_expiration = 3500

    def __init__(self):
        # the function that is executed when
        # an instance of the class is created
        self.url = current_app.config["PETFINDER_API"]
        self.key = current_app.config["PETFINDER_API_KEY"]
        self.secret = current_app.config["PETFINDER_API_SECRET"]
        try:
            current_app.access_token = self.getAccessToken()
            if current_app.access_token is None:
                raise Exception("Request for access token failed.")
        except Exception as e:
            current_app.logger.error(e)


    def getAccessToken(self):
        # the function that is
        # used to request the JWT
        try:
            # build the JWT and store
            # in the variable `token_body`
            token_body = {
              "grant_type": "client_credentials",
              "client_id": self.key,
              "client_secret": self.secret
            }

            # request an access token
            request = requests.post(f"{self.url}/oauth2/token",data=token_body)

            # optional: raise exception for status code
            request.raise_for_status()
        except Exception as e:
            current_app.logger.error(e)
            return None
        else:
            # assuming the response's structure is
            # {"access_token": ""}
            return request.json()["access_token"]

    class Decorators():
        @staticmethod
        def refreshToken(decorated):
            # the function that is used to check
            # the JWT and refresh if necessary
            def wrapper(api,*args,**kwargs):
                current_app.logger.error("refresh token called")
                if not current_app.access_token or time.time() > api.access_token_expiration:
                    current_app.access_token = api.getAccessToken()
                    current_app.logger.error(current_app.access_token)
                return decorated(api,*args,**kwargs)

            return wrapper

    @Decorators.refreshToken
    def get_pets(self):
        headers = { 'Authorization' : 'Bearer ' + current_app.access_token }
        response = requests.get(f"{self.url}/animals?type=dog", headers=headers)
        return response.json()