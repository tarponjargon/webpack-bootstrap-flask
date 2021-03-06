import requests
from requests.exceptions import HTTPError
import time
import copy
from flask import current_app


class PetFinder:
    """API request module for petfinder.com.  Wraps all requests in a token-expired check which auto-renews their oauth token if necessary"""

    url = None
    key = None
    secret = None

    def __init__(self):
        self.url = current_app.config["PETFINDER_API"]
        self.key = current_app.config["PETFINDER_API_KEY"]
        self.secret = current_app.config["PETFINDER_API_SECRET"]

    def request_token(self):
        try:
            token_body = {
                "grant_type": "client_credentials",
                "client_id": self.key,
                "client_secret": self.secret,
            }
            request = requests.post(f"{self.url}/oauth2/token", data=token_body)
            request.raise_for_status()
        except Exception as e:
            current_app.logger.error(e)
            return None
        else:
            token = request.json()
            token["last_auth"] = time.time()
            current_app.config["PETFINDER_AUTH"] = token
            return True

    class refresh_jwt:
        @staticmethod
        def refresh_token(decorated):
            def wrapper(api, *args, **kwargs):
                if "PETFINDER_AUTH" not in current_app.config:
                    api.request_token()
                else:
                    last_auth = current_app.config["PETFINDER_AUTH"]["last_auth"]
                    token_exp = current_app.config["PETFINDER_AUTH"]["expires_in"]
                    if int(time.time() - last_auth) > token_exp:
                        api.request_token()
                return decorated(api, *args, **kwargs)

            return wrapper

    @refresh_jwt.refresh_token
    def get_puppies(self, params={"type": "dog", "sort": "random"}):
        headers = {"Authorization": "Bearer " + current_app.config["PETFINDER_AUTH"]["access_token"]}
        obj = {"animals": []}
        response = None
        data = {}
        try:
            response = requests.get(f"{self.url}/animals", headers=headers, params=params)
            response.raise_for_status()
        except HTTPError as http_err:
            current_app.logger.error(http_err)
        except Exception as err:
            current_app.logger.error(err)
        else:
            data = response.json()

        # scrub PID from response
        if data and "animals" in data:
            obj["pagination"] = data["pagination"]
            for animal in data["animals"]:
                puppy = copy.deepcopy(animal)
                try:
                    puppy["contact"]["address"]["address1"] = None
                    puppy["contact"]["email"] = None
                    puppy["contact"]["phone"] = None
                except KeyError:
                    pass
                obj["animals"].append(puppy)
        return obj

    @refresh_jwt.refresh_token
    def get_puppy(self, id):
        headers = {"Authorization": "Bearer " + current_app.config["PETFINDER_AUTH"]["access_token"]}
        response = None
        data = {}
        try:
            response = requests.get(f"{self.url}/animals/{id}", headers=headers)
            response.raise_for_status()
        except HTTPError as http_err:
            current_app.logger.error(http_err)
        except Exception as err:
            current_app.logger.error(err)
        else:
            data = response.json()

        # scrub PID from response
        try:
            data["animal"]["contact"]["address"]["address1"] = None
            data["animal"]["contact"]["email"] = None
            data["animal"]["contact"]["phone"] = None
        except KeyError:
            pass
        return data

    @refresh_jwt.refresh_token
    def get_features(self):
        params = {"type": "dog", "sort": "random", "age": "baby"}
        headers = {"Authorization": "Bearer " + current_app.config["PETFINDER_AUTH"]["access_token"]}
        animals = []
        response = None
        try:
            response = requests.get(f"{self.url}/animals", headers=headers, params=params)
            response.raise_for_status()
        except HTTPError as http_err:
            current_app.logger.error(http_err)
        except Exception as err:
            current_app.logger.error(err)
        else:
            animals = response.json()["animals"]

        return animals
