import Splide from "@splidejs/splide";
import Favorite from "../modules/Favorite";
import { renderThumbnail } from "../components/Thumbnail";
import { getJson } from "../modules/Utils";

export default class Puppy {
  constructor() {
    this.galleryEl = document.getElementById("main-image-sync");
    this.suggestionsEl = document.querySelector('[data-js="suggestions-container"]');
  }

  init = async () => {
    if (this.galleryEl) this.startGallery();
    const data = await getJson(`/api/puppies`);
    if (data && data.animals) {
      this.renderSuggestions(data.animals);
      this.favorite = new Favorite(this.suggestionsEl);
      this.favorite.init();
    }
  };

  startGallery = () => {
    // Create and mount the thumbnails slider.
    const secondarySlider = new Splide("#thumbnail-sync", {
      rewind: true,
      fixedWidth: 100,
      fixedHeight: 64,
      isNavigation: true,
      gap: 10,
      pagination: false,
      cover: true,
      breakpoints: {
        600: {
          fixedWidth: 66,
          fixedHeight: 40,
        },
      },
    }).mount();

    // Create the main slider.
    const primarySlider = new Splide("#main-image-sync", {
      type: "fade",
      heightRatio: 0.9,
      pagination: false,
      arrows: false,
      cover: true,
    });

    // Set the thumbnails slider as a sync target and then call mount.
    primarySlider.sync(secondarySlider).mount();
  };

  renderSuggestions = (suggestions) => {
    const suggestionsHtml = `
      <div class="row">
        ${suggestions.map((p) => renderThumbnail(p)).join("")}
      </div>
    `;

    this.suggestionsEl.innerHTML = suggestionsHtml;
  };
}
