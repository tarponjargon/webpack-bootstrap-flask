import "./scss/style.scss";
import "bootstrap";
import Globals from "./js/views/Globals";

const globals = new Globals();
globals.init();

console.log("loaded", CFG);
