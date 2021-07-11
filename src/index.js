import "./scss/style.scss";
import "bootstrap";
import routes from "./js/routes";
import Globals from "./js/views/Globals";

// init route controllers
routes().then((res) => console.log(res));

// init behavior needed on every page
const globals = new Globals();
globals.init();
