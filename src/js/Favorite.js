import myToast from "./Toast";
import { getJson } from "./Utils";

export default class Favorite {
  // CRUD methods for puppy favorites.  the data store is a JSON object in localstorage
  constructor() {
    this.key = "puppies";
    const ls = localStorage.getItem(this.key);
    this.puppies = ls ? JSON.parse(ls) : [];
    this.toast = new myToast();
  }

  init = () => {
    return new Promise((resolve) => {
      // attach click handlers to favorite btns
      const favoriteBtns = Array.from(document.querySelectorAll("[data-favorite]"));
      favoriteBtns.map((s) => s.addEventListener("click", this.favoriteClick, false));

      // update default state for any previously selected favorites in view
      this.puppies.forEach((i) => {
        this.toggleButton(i.id);
      });

      // update favorite count in UI
      this.updateCount(this.puppies.length);

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
    const newPuppies = [...this.puppies];
    const puppy = await getJson(`/api/puppy/${id}`);
    newPuppies.unshift(puppy);
    this.setFavorites(newPuppies);
    this.toggleButton(id);
    this.toast.success("Favorite added!");
  };

  removeFavorite = (id) => {
    const newPuppies = this.puppies.filter((i) => i.id.toString() !== id.toString());
    this.setFavorites(newPuppies);
    this.toggleButton(id);
    this.toast.danger("Favorite removed");
  };

  setFavorites = (newPuppies) => {
    this.puppies = newPuppies.slice(0, CFG.maxFavorites);
    localStorage.setItem(this.key, JSON.stringify(this.puppies));
    this.updateCount(this.puppies.length);
  };

  getFavoriteById = (id) => {
    return this.puppies.find((i) => i.id.toString() === id.toString());
  };

  toggleButton = (id) => {
    const el = document.querySelector(`[data-favorite="${id}"] i`);
    if (el) el.classList.toggle("fw-bold");
  };

  updateCount = (count) => {
    document.querySelector('[data-js="fav-count"]').innerText = count;
  };
}
