


# Webpack, Bootstrap, Flask

This is a demo project that provides scaleable scaffolding for a webpack-bootstrap-flask website stack. And also helps you find a puppy!

![a puppy](https://puppies.thewhiteroom.com/assets/images/binx.jpg)

### [See demo](https://puppies.thewhiteroom.com/)
For portability I did not use a database. Instead, the data source for the site is the server-to-server [PetFinder API](https://www.petfinder.com/developers/v2/docs/), so it does load a tad slower because every request spawns a subsequent http request to PetFinder from the back-end.

I wanted to illustrate how to architect, develop and code-split vanilla Javascript application code for a "traditional" server-side-rendered website, so I didn't use a front-end lib like React or Vue (though you could add one easily with npm).  I did add some [example API routes](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/flask_app/routes/api.py) in Flask.

Even though this is a single repo, the front end and the back end are *two separate* applications.

As such, they require separate configuration. This isn't a push-button install, you kind of have to enjoy a little configuration in your life :D [Webpack](https://webpack.js.org/) is famous for that!

Assumes full-fledged UNIX-like system (like macOS, linux). System prerequisites:
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

The setup of the back-end is fairly straightforward [Flask](https://flask.palletsprojects.com/en/2.0.x/) and [Gunicorn](https://gunicorn.org/), with routes and templates in the standard locations. Similarly, the front-end is in a standard "Javascript project" format, with code living in `src` and `node_modules`. However, front-end and back-end are two different web development paradigms these days, so it's helpful to describe how I am getting them to work together.

*(This is where somewhat merited complaints about modern web applications being overly complex kick in :D)*

When webpack builds assets, it places them in `flask_app/assets`  *and* writes `<script>` and `<link>` tags to `flask_app/templates/assets.inc`, which Flask then includes in the `<head>` of the base template. That is how Flask is "aware" of the core assets webpack builds, and can serve them in the HTML.

example of a webpack-generated `assets.inc` file's contents:

	<script defer="defer" src="/assets/app.f13cf3a4ed3464457be4.js?f13cf3a4ed3464457be4"></script><link href="/assets/app.f13cf3a4ed3464457be4.css?f13cf3a4ed3464457be4" rel="stylesheet">

The core front-end app that webpack builds, is *all* of the css (app.css), and all JS modules that are shared across all views of the site (app.js). So if you have a JS widget in the header (in this case "favorites"), since that appears on every view, that JS needs to be in the core application.

Also, generally speaking, each route is "controlled" with a JS module that is specific to that view. So for example `/contact` has a corresponding JS controller [`src/js/views/Contact.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/views/Contact.js) that is loaded *only* for that route and handles form submission/error handling, etc.

 Webpack handles all the requisite code-splitting and module loading, but you have to specify *how* to split the code so that the browser loads the appropriate JS at the appropriate time. This is done in [`src/routes.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/routes.js).

You add a block for each route (though you can use any condition, like existence of a DOM element), and it will dynamically load the corresponding module(s) ("chunks"). The [webpackPrefetch](https://webpack.js.org/guides/code-splitting/) magic comments handle adding the `prefetch` resource hints to the DOM, so the browser will lazily load and cache the entire app on the first load.

So yes, adding routes does indeed require several steps:
1. Add route to [`flask_app/views.py`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/flask_app/routes/views.py)
2. Add template for route to `flask_app/templates`
3. Add a Javascript controller for the route (if necessary) to `src/js/views`
4. Tell the Front-end application when to load the controller in [`src/js/routes.js`](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/src/js/routes.js)

It's not like the days when you'd FTP a HTML file to a server directory and you're done!
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
As previously mentioned, the front-end and back-end apps have to be configured separately. Back-end app config variables can be specified in`config/config.py` (note separate blocks for each environment).

Config variables for the front-end app are specified in `config/default.js` (vars shared across all environments), `config/development.js`, `config/staging.js`, and `config/production.js`.  SCSS variables are specified in `src/scss/_variables.scss`.

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

Gunicorn does not have built-in log rotation, so you'll need to set it up seprately. See this [example logrotate.d script](https://github.com/tarponjargon/webpack-bootstrap-flask/blob/master/sample.logrotate).

Assuming you'll keep your project in a git repo, an example deployment action would be a sequence like:

    git pull
    git run ci
    npm run build

Gunicorn is configured to watch files so it should restart automatically.

#Acknowledgements

I modified the MIT-licensed Bootstrap [Freelancer](https://startbootstrap.com/theme/freelancer) template.