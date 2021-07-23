import Glider from "glider-js";

export default class Home {
  constructor() {
    this.carouselEl = document.querySelector("[data-js='homepage-carousel']");
    this.prevBtn = document.querySelector("[data-js='homepage-carousel-prev']");
    this.nextBtn = document.querySelector("[data-js='homepage-carousel-next']");
    this.slider = null; // Glider.js carousel instance
    this.autoplayDelay = 5000;
    this.autoplay = null; // autoplay setInterval instance
  }

  init = () => {
    return new Promise((resolve) => {
      this.slider = new Glider(this.carouselEl, {
        slidesToShow: 1,
        slidesToScroll: 1,
        scrollLock: true,
        draggable: true,
        rewind: true,
        arrows: {
          prev: this.prevBtn,
          next: this.nextBtn,
        },
      });
      this.startSlider();
      this.prevBtn.addEventListener("click", this.stopSlider, false);
      this.nextBtn.addEventListener("click", this.stopSlider, false);
      resolve();
    });
  };
  startSlider = () => {
    this.autoplay = setInterval(() => {
      this.slider.scrollItem("next");
    }, this.autoplayDelay);
  };
  stopSlider = () => {
    clearInterval(this.autoplay);
  };
}
