import "./scss/style.scss";
import "bootstrap"; // inits bootstrap for any data-api stuff on pages
import routes from "./js/routes";
import Global from "./js/modules/Global";
import Favorite from "./js/modules/Favorite";

// init route controllers (handles code-splitting)
routes();

// init DOM funcions needed on every page
const global = new Global();
global.init();

// init favorite handlers globally
const favorite = new Favorite();
favorite.init();
