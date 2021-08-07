
# Webpack, Bootstrap, Flask

Provides scaleable scaffolding for a webpack-bootstrap-flask website stack. And also helps you [find a puppy](https://puppies.thewhiteroom.com/)!

![a puppy](https://puppies.thewhiteroom.com/assets/images/binx.jpg)

### [See demo](https://puppies.thewhiteroom.com/)
Thie repo contains a demo site that is primarily a server-side application using [Flask 2](https://flask.palletsprojects.com/en/2.0.x/) and [Gunicorn](https://gunicorn.org/), but does have vanilla-Javascript client-side functionality facilitated by [Webpack 5](https://webpack.js.org/).  It uses [Bootstrap 5-flavored](https://getbootstrap.com/docs/5.0/getting-started/introduction/) HTML/CSS/Javascript widgets.

Webpack is commonly used for client-slide applications, and there's not much information about how it can be implemented for applications that are largely server-side. I aim to change that!

That said, a client-side library (React, Vue, etc) can easily be added via npm, and there are [example API routes](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/flask_app/routes/api.py) built into the demo.

Even though this is a single repo, the front end and the back end are *two separate* applications. As such, they require separate configuration. This isn't a push-button install, you kind of have to enjoy a little configuration in your life :D

For portability I did not use a database. Instead, the data source for the site is the server-to-server [PetFinder API](https://www.petfinder.com/developers/v2/docs/), so it does load a tad slower because every request spawns a subsequent http request to PetFinder from the back-end.

Assumes install on UNIX-like systems (like macOS, linux).  Prerequisites:
- python3.6+ and [virtualenv](https://docs.python-guide.org/dev/virtualenvs/)
- git, npm, and node 14+
-  [direnv](https://shivamarora.medium.com/a-guide-to-manage-your-environment-variables-in-a-better-way-using-direnv-2c1cd475c8e) (not strictly required but very helpful)

## Documentation
1.  [Architecture](#architecture)
2.  [Installation](#installation)
3.  [Environments](#environments)
4.  [Configuration](#configuration)
5.  [Testing](#testing)
6.  [Deployment](#deployment)

<a  name="architecture"></a>
## Architecture

The setup of the back-end is fairly straightforward Flask living in [`flask_app`](https://github.com/tarponjargon/webpack-bootstrap-flask/tree/master/flask_app), with routes and templates in the standard locations. Similarly, the front-end is in a standard "Javascript project" format, with app code living in `src` and npm packages in `node_modules`.

*(This is where somewhat merited complaints about modern web applications being overly complex kick in :D)*

When webpack builds assets, it outputted files them in `flask_app/assets` *rather than* the traditional `dist` (directory and contents are automatically created).

[HTMLWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/) uses the template [`src/assets.inc`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/assets.inc) to generate and output `flask_app/templates/assets.inc`, which contains `<script>` and `<link>` tags pointing to the outputted webpack assets.  Flask then includes in the `<head>` of the base template. That is how Flask is "aware" of the core assets webpack builds, and can serve them in the HTML.

example of a webpack-generated `assets.inc` file's contents:

	<script defer="defer" src="/assets/app.f13cf3a4ed3464457be4.js?f13cf3a4ed3464457be4"></script><link href="/assets/app.f13cf3a4ed3464457be4.css?f13cf3a4ed3464457be4" rel="stylesheet">

Webpack compiles all of the css into `app.[fingerprint].css`, and "core" JS (shared across all routes) into `app.[fingerprint].js`. So for example, if you have a JS widget in the header (this site uses "favorites"), since that appears globally, that JS needs to be in the core application loaded for every route.

### Code Splitting

Each route can also have its own "controller", a JS module that is specific to that view. So for example `/contact` has a corresponding JS controller [`src/js/views/Contact.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/views/Contact.js) that is loaded *only* for that route and handles form submission/error handling, etc.

 Webpack handles all the requisite code-splitting and module loading, but you have to specify *how* to split the code so that the browser loads the appropriate JS at the appropriate time. This is done in [`src/routes.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/routes.js).

You add a block for each route, and it will dynamically load the corresponding module(s) ("chunks"). The [webpackPrefetch](https://webpack.js.org/guides/code-splitting/) magic comments handle adding the `prefetch` resource hints to the DOM, so the browser will lazily load and cache the entire app on the first load.

The conditions for dynamic module/chunk loading doesn't *have* to be by route.  You can load multiple chunks per page view by adding a condition (for example, existence of a DOM element) to [`src/routes.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/routes.js).

The "cost" of this setup is that there are several steps to creating routes:
1. Add route to [`flask_app/views.py`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/flask_app/routes/views.py)
2. Add template for route to [`flask_app/templates`](https://github.com/tarponjargon/webpack-bootstrap-flask/tree/master/flask_app/templates)
3. Add a Javascript controller for the route (if desired) to [`src/js/views`](https://github.com/tarponjargon/webpack-bootstrap-flask/tree/master/src/js/views)
4. Tell the Front-end application when to load the controller in [`src/js/routes.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/routes.js)

It's not like the days when you'd FTP files to server directories and you're done.
<a  name="installation"></a>
## Installation

    mkdir project
    cd project
    git clone https://github.com/tarponjargon/webpack-bootstrap-flask.git .
    virtualenv -p $(which python3) virtualenv_python
    source virtualenv_python/bin/activate
    mkdir tmp logs
    pip3 install -r requirements.txt
    npm install

<a  name="environments"></a>
## Environments
This project has 3 environments: development, staging and production.

You'll need to set environment variables in each environment separately. The best way to do this is with [direnv](https://shivamarora.medium.com/a-guide-to-manage-your-environment-variables-in-a-better-way-using-direnv-2c1cd475c8e), though you could add them directly to your `.bashrc`.

For the development environment, see [this file](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.envrc) for the exact variables. If you're using direnv, you can just:

    mv sample.envrc .envrc
    direnv allow

Now, you can start the development servers (webpack-dev-server and Gunicorn):

    npm run start

Then go to [http://localhost:8080](http://localhost:8080) in your browser.

<a  name="configuration"></a>
## Configuration
As previously mentioned, the front-end and back-end apps have to be configured separately. Back-end (Flask) app config variables can be specified in [`config/config.py`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/config.py) (note separate blocks for each environment).

Gunicorn's config is in [`config/gunicorn.py`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/gunicorn.py), though I tried to minimize the need to touch this file directly by leaning on varaibles set in the environment [`.envrc`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.envrc)

Webpack's (infamous) config is in [`config/webpack.config.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/webpack.config.js).

Additional front-end config variables are set in files specific to each environemnt.  These variables become available in the browser app via a `CFG` object (scoped to the app).  Don't put secrets in there.
- [`config/default.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/default.js) (variables shared across all environments)
- [`config/development.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/development.js)
- [`config/staging.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/staging.js)
- [`config/production.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/config/production.js)

SCSS variables (to set colors, override Bootstrap, etc) are specified in [`src/scss/_variables.scss`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/scss/_variables.scss)

They don't call it a "stack" for nuthin'!

<a  name="testing"></a>
## Testing
There is a [Cypress](https://www.cypress.io/) end-to-end test suite for the demo project in `cypress/integration`. If the server is running, you can the tests with:

    npm run test
If not you can do a CI run:

    npm run ci

To do TDD, you can run this while your devserver is running:

    $(npm bin)/cypress open


<a  name="deployment"></a>
## Deployment
This stack is designed to be run as a non-privileged user. So, in staging/production environments, install as a regular user.

While you *could* configure Gunicorn to handle all requests, you should use a primary webserver like Apache or Nginx to handle SSL and static assets.  Set up a reverse proxy for application requests to Flask/Gunicorn.

[Example Apache configuration](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.apache.vhost)

[Example Nginx configuration](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.nginx.conf)

Staging and production environments will need a system-level start script for Flask/Gunicorn. See this [example systemd script](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.systemd.conf).

It's handy for the user to be allowed to stop/start/restart. See this [example visudo entry](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.visudo).

Gunicorn does not have built-in log rotation, so you'll need to set it up separately. See this [example logrotate.d script](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.logrotate).

Assuming you'll keep your project in a git repo, an example deployment action would be a sequence like:

    git pull
    git run ci
    npm run build

Gunicorn is configured to watch files so it should restart automatically.

## Acknowledgements

I modified the MIT-licensed Bootstrap [Freelancer](https://startbootstrap.com/theme/freelancer) template.