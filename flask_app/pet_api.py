import requests
import time
from pprint import pprint
from flask import current_app


class PetApi:
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
            print(f"TOKEN ADDED AT {token['last_auth']}")
            return True

    class refresh_jwt:
        @staticmethod
        def refresh_token(decorated):
            def wrapper(api, *args, **kwargs):
                if "PETFINDER_AUTH" not in current_app.config:
                    print("TOKEN DOES NOT EXIST, REQUESTING")
                    api.request_token()
                else:
                    print("TOKEN DOES EXIST, CHECKING EXP")
                    pprint(current_app.config["PETFINDER_AUTH"])
                    last_auth = current_app.config["PETFINDER_AUTH"]["last_auth"]
                    token_exp = current_app.config["PETFINDER_AUTH"]["expires_in"]
                    print(last_auth)
                    print(time.time())
                    print(token_exp)
                    print(int(time.time() - last_auth))
                    if int(time.time() - last_auth) > token_exp:
                        print("TOKEN IS EXPIRED, GETTING NEW")
                        api.request_token()
                    else:
                        print("TOKEN IS NOT EXPIRED")
                return decorated(api, *args, **kwargs)

            return wrapper

    @refresh_jwt.refresh_token
    def get_pets(self):
        headers = {"Authorization": "Bearer " + current_app.config["PETFINDER_AUTH"]["access_token"]}
        response = requests.get(f"{self.url}/animals?type=dog", headers=headers)
        return response.json()
