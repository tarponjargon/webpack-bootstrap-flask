export default class Favorites {
  constructor() {}

  init = () => {
    return new Promise((resolve, reject) => {
      // attach click handlers to favorite btns
      const favoriteBtns = Array.from(document.querySelectorAll("[data-favorite]"));
      favoriteBtns.map((s) => s.addEventListener("click", this.addFavorite, false));

      resolve("favorites initted");
    });
  };

  addFavorite = (e) => {
    e.preventDefault();
    if (e.currentTarget.getAttribute("data-favorite")) {
      const id = e.currentTarget.getAttribute("data-favorite");
      console.log("id", id);
    }
  };
}
