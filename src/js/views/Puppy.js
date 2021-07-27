import Splide from "@splidejs/splide";

export default class Puppy {
  constructor() {
    this.el = document.getElementById("main-image-sync");
  }

  init = () => {
    if (this.el) this.startGallery();
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
}
