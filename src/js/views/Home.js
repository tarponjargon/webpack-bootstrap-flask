import { Modal } from "bootstrap";
import Splide from "@splidejs/splide";
import { getJson } from "../modules/Utils";
import { renderModal } from "../components/Modal";

export default class Home {
  constructor() {
    this.modal = new Modal(document.getElementById("myModal"));
    this.subfeaturesEl = document.querySelector('[data-js="subfeatures-container"]');
    this.modalContentEl = document.querySelector('[data-js="modal-content"]');

    this.carouselEl = document.querySelector("[data-js='homepage-carousel']");
    this.slider = null; // carousel instance
  }

  init = () => {
    return new Promise((resolve) => {
      this.slider = new Splide(this.carouselEl, {
        perPage: 3,
        perMove: 3,
        rewind: true,
        pagination: false,
        autoplay: true,
        breakpoints: {
          768: {
            perPage: 1,
            perMove: 1,
          },
          1024: {
            perPage: 2,
            perMove: 2,
          },
        },
      });
      this.slider.mount();
      const modals = Array.from(document.querySelectorAll("[data-puppy-modal]"));
      modals.map((s) => s.addEventListener("click", this.modalHandler, false));

      resolve();
    });
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
