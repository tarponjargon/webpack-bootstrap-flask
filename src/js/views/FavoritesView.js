import Favorite from "../modules/Favorite";
import { renderThumbnail } from "../components/Thumbnail";

export default class FavoritesView {
  constructor() {
    this.favorite = new Favorite();
    this.container = document.querySelector('[data-js="favorites-container"]');
  }

  init = () => {
    return new Promise((resolve, reject) => {
      this.renderFavorites();
      this.favorite.init();
      this.unFavoriteHandler();
    });
  };

  unFavoriteHandler = () => {
    // if a favorite is removed, re-render
    document.addEventListener("favoriteremoved", (e) => {
      this.renderFavorites();
      this.favorite.init();
    });
  };

  renderFavorites = () => {
    let favoriteHTML = "";
    if (this.favorite.puppies.length) {
      favoriteHTML = `
        <div class="row">
          ${this.favorite.puppies.map((p) => renderThumbnail(p)).join("")}
        </div>
      `;
    } else {
      favoriteHTML = `
        <h2>No favorites yet! <i class="fas fa-sad-tear fw-normal"></i></h2>
        <p>
          <a href="/puppies">Find some puppies</a>.
        </p>
      `;
    }
    this.container.innerHTML = favoriteHTML;
  };
}
