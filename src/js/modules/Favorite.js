import myToast from "./Toast";
import { getJson } from "./Utils";

export default class Favorite {
  // CRUD methods for puppy favorites.  petfinder doesn't allow bulk lookups, so looking up each favorite
  // by id would be a separate http request.  So I am storing the favorite json objects as an array in
  // localStorage
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
      favoriteBtns.map((s) => s.addEventListener("click", this.favoriteHandler, false));

      // update default state for any previously selected favorites in view
      this.puppies.forEach((i) => {
        this.toggleButton(i.id);
      });

      // update favorite count in UI
      this.updateCount(this.puppies.length);

      resolve();
    });
  };

  favoriteHandler = (e) => {
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
    // announces to the rest of the app that a favorite has been added
    const favoriteAdded = new CustomEvent("favoriteadded", { detail: { id } });
    document.dispatchEvent(favoriteAdded);
  };

  removeFavorite = (id) => {
    const newPuppies = this.puppies.filter((i) => i.id.toString() !== id.toString());
    this.setFavorites(newPuppies);
    this.toggleButton(id);
    this.toast.danger("Favorite removed");
    // announces to the rest of the app that a favorite has been removed
    const favoriteRemoved = new CustomEvent("favoriteremoved", { detail: { id } });
    document.dispatchEvent(favoriteRemoved);
  };

  setFavorites = (newPuppies) => {
    // save to localStorage and update count in UI
    this.puppies = newPuppies.slice(0, CFG.maxFavorites);
    localStorage.setItem(this.key, JSON.stringify(this.puppies));
    this.updateCount(this.puppies.length);
  };

  getFavoriteById = (id) => {
    return this.puppies.find((i) => i.id.toString() === id.toString());
  };

  toggleButton = (id) => {
    // show the favorite button as solid if favorited (or remove)
    const el = document.querySelector(`[data-favorite="${id}"] i`);
    if (el) el.classList.toggle("fw-bold");
  };

  updateCount = (count) => {
    // update count in UI
    document.querySelector('[data-js="fav-count"]').innerText = count;
  };
}
