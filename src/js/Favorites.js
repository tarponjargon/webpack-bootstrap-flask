import myToast from "./Toast";
import { getJson } from "./Utils";

export default class Favorites {
  // CRUD methods for puppy favorites.  the data store is a JSON object in localstorage
  constructor() {
    const ls = localStorage.getItem("favorites");
    this.favorites = ls ? JSON.parse(ls) : [];
    this.toast = new myToast();
  }

  init = () => {
    return new Promise((resolve) => {
      // attach click handlers to favorite btns
      const favoriteBtns = Array.from(document.querySelectorAll("[data-favorite]"));
      favoriteBtns.map((s) => s.addEventListener("click", this.favoriteClick, false));

      // update default state for any previously selected favorites in view
      this.favorites.forEach((i) => {
        this.toggleButton(i.id);
      });

      // update favorite count in UI
      this.updateCount(this.favorites.length);

      resolve();
    });
  };

  favoriteClick = (e) => {
    e.preventDefault();
    if (e.currentTarget.getAttribute("data-favorite")) {
      const id = e.currentTarget.getAttribute("data-favorite");
      if (this.getFavoriteById(id)) {
        // a click on an active favorite toggles it off
        this.removeFavorite(id);
      } else {
        this.addFavorite(id);
      }
    }
  };

  addFavorite = async (id) => {
    const newFavorites = [...this.favorites];
    const puppy = await getJson(`/api/puppy/${id}`);
    newFavorites.unshift(puppy);
    this.setFavorites(newFavorites);
    this.toggleButton(id);
    this.toast.success("Favorite added!");
  };

  removeFavorite = (id) => {
    const newFavorites = this.favorites.filter((i) => i.id.toString() !== id.toString());
    this.setFavorites(newFavorites);
    this.toggleButton(id);
    this.toast.danger("Favorite removed");
  };

  setFavorites = (newFavorites) => {
    this.favorites = newFavorites.slice(0, CFG.maxFavorites);
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
    this.updateCount(this.favorites.length);
  };

  getFavoriteById = (id) => {
    return this.favorites.find((i) => i.id.toString() === id.toString());
  };

  toggleButton = (id) => {
    const el = document.querySelector(`[data-favorite="${id}"] i`);
    if (el) el.classList.toggle("fw-bold");
  };

  updateCount = (count) => {
    document.querySelector('[data-js="fav-count"]').innerText = count;
  };
}
