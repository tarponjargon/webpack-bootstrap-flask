import "./scss/style.scss";
import "bootstrap";
import routes from "./js/routes";
import Globals from "./js/views/Globals";
import Favorites from "./js/Favorites";

// init route controllers (handles code-splitting)
routes().then((res) => console.log(res));

// init behavior needed on every page
const globals = new Globals();
globals.init();

// init handlers for favorite puppies
const favorites = new Favorites();
favorites.init();
