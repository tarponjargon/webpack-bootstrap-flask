import Favorite from "../Favorite";

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

  puppyImage = (puppy) => {
    let src = CFG.defaultImage;
    try {
      src = puppy.primary_photo_cropped.medium;
    } catch (e) {}
    return src;
  };

  renderFavorites = () => {
    let favoriteHTML = "";
    if (this.favorite.puppies.length) {
      favoriteHTML = `
        <div class="row">
          ${this.favorite.puppies.map((p) => this.renderThumbnail(p)).join("")}
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

  renderThumbnail = (puppy) => {
    return `
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 text-center pb-5">
        <div class="card-box h-100 position-relative">
          <button
            class="favorite-container"
            title="Remove from favorites :("
          >
            <div
              class="favorite pt-1 text-danger"
              data-favorite="${puppy.id}"
            >
              <i class="fas fa-heart"></i>
            </div>
          </button>
          <div class="card-thumb-container">
            <div class="card-thumbnail">
              <a href="/puppy/${puppy.id}">
                <img
                  src="${this.puppyImage(puppy)}"
                  class="custom-img-fluid"
                  alt="${puppy.name}"
                >
                </a>
            </div>
          </div>
          <div class="card-foot">
            <div class="card-title">
              <h2>
                <a href="/puppy/${puppy.id}">
                ${puppy.name} -
                ${puppy.contact.address.city},
                ${puppy.contact.address.state}
                </a>
              </h2>
            </div>
          </div>
        </div>
      </div>
    `;
  };
}
