import { Modal } from "bootstrap";
import Glider from "glider-js";
import { getJson } from "../modules/Utils";
import { renderModal } from "../components/Modal";

export default class Home {
  constructor() {
    this.modal = new Modal(document.getElementById("myModal"));
    this.modalContentEl = document.querySelector('[data-js="modal-content"]');
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
        responsive: [
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              itemWidth: 320,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              itemWidth: 320,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              itemWidth: 320,
            },
          },
        ],
      });
      Array.from(this.carouselEl.querySelectorAll(".glider-slide")).map((i) =>
        i.classList.remove("invisible")
      );
      this.startSlider();
      this.prevBtn.addEventListener("click", this.stopSlider, false);
      this.nextBtn.addEventListener("click", this.stopSlider, false);

      const modals = Array.from(document.querySelectorAll("[data-puppy-modal]"));
      modals.map((s) => s.addEventListener("click", this.modalHandler, false));

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
  modalHandler = async (e) => {
    e.preventDefault();
    if (e.currentTarget.getAttribute("data-puppy-modal")) {
      const id = e.currentTarget.getAttribute("data-puppy-modal");
      const puppy = await getJson(`/api/puppy/${id}`);
      this.modalContentEl.innerHTML = renderModal(puppy);
      this.modal.show();
    }
  };
}
