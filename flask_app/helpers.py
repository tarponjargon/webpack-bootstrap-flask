from urllib.parse import urlparse, urlencode
from flask import render_template, request, escape


def page_not_found(e=None):
    return render_template("404.html.j2"), 404


def add_security_headers(response):
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


def safe_param(key):
    if request.args.get(key) is None:
        return None
    return escape(request.args.get(key))


def get_qs(url):
    parsed_url = urlparse(url)
    return parsed_url.query


def make_qs(params, exclude=None):
    clean_dict = {k: v for k, v in params.items() if k != exclude and v is not None}
    return urlencode(clean_dict)
