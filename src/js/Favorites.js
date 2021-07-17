import Cookies from "js-cookie";
import myToast from "./Toast";

export default class Favorites {
  constructor() {
    this.favorites = this.getFavorites();
    this.toast = new myToast();
  }

  init = () => {
    return new Promise((resolve, reject) => {
      // attach click handlers to favorite btns
      const favoriteBtns = Array.from(document.querySelectorAll("[data-favorite]"));
      favoriteBtns.map((s) => s.addEventListener("click", this.favoriteClick, false));

      // update default state for any pre-selected favorites
      this.favorites.forEach((i) => {
        this.toggleButton(i);
      });

      // update favorite count in UI
      this.updateCount(this.favorites.length);
    });
  };

  favoriteClick = (e) => {
    e.preventDefault();
    if (e.currentTarget.getAttribute("data-favorite")) {
      const id = e.currentTarget.getAttribute("data-favorite");
      if (this.favorites.includes(id)) {
        // a click on an active favorite toggles it off
        this.removeFavorite(id);
      } else {
        this.addFavorite(id);
      }
    }
  };

  getFavorites = () => {
    const cookie = Cookies.get("favorites");
    return cookie ? JSON.parse(cookie) : [];
  };

  addFavorite = (id) => {
    const newFavorites = [...this.favorites];
    newFavorites.push(id);
    this.setFavorites(newFavorites);
    this.toggleButton(id);
    this.toast.show("Favorite added!");
  };

  removeFavorite = (id) => {
    const newFavorites = this.favorites.filter((i) => i !== id);
    this.setFavorites(newFavorites);
    this.toggleButton(id);
    this.toast.show("Favorite removed");
  };

  setFavorites = (newFavorites) => {
    this.favorites = newFavorites.slice(0, CFG.maxFavorites);
    Cookies.set("favorites", JSON.stringify(this.favorites), {
      expires: CFG.expireFavorites,
      path: "/",
    });
    this.updateCount(this.favorites.length);
  };

  toggleButton = (id) => {
    const el = document.querySelector(`[data-favorite="${id}"] i`);
    if (el) el.classList.toggle("fw-bold");
  };

  updateCount = (count) => {
    document.querySelector('[data-js="fav-count"]').innerText = count;
  };
}
