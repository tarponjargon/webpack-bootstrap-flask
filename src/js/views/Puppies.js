export default class Puppies {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
  }

  init = () => {
    return new Promise((resolve, reject) => {
      // attach change handlers to select menus
      const selects = Array.from(document.querySelectorAll('[data-js="param-change"]'));
      selects.map((s) => s.addEventListener("change", this.updateResults, false));

      resolve("Puppies controller loaded");
    });
  };

  updateResults = (e) => {
    const el = e.target;
    const param = el.getAttribute("name");
    const val = el.options[el.selectedIndex].value;
    this.params.delete("page");
    this.params.set(param, val);
    window.location = window.location.pathname + "?" + this.params.toString();
  };
}
