import { Modal } from "bootstrap";
import Splide from "@splidejs/splide";
import { getJson } from "../modules/Utils";
import { renderSubfeature } from "../components/Subfeature";
import { renderModal } from "../components/Modal";

export default class Home {
  constructor() {
    this.modal = new Modal(document.getElementById("myModal"));
    this.subfeaturesEl = document.querySelector('[data-js="subfeatures-container"]');
    this.modalContentEl = document.querySelector('[data-js="modal-content"]');
    this.carouselEl = document.querySelector("[data-js='homepage-carousel']");
    this.subFeatures = [];
  }

  init = () => {
    return new Promise((resolve) => {
      const slider = new Splide(this.carouselEl, {
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
      slider.mount();
      this.loadSubfeatures().then(() => resolve());
    });
  };

  loadSubfeatures = async () => {
    const data = await getJson(`/api/puppies`);
    this.puppies = data.animals
      .filter((i) => i.primary_photo_cropped && i.primary_photo_cropped.medium)
      .slice(0, 6);
    this.renderSubfeatures(this.puppies);
    const modals = Array.from(this.subfeaturesEl.querySelectorAll("[data-puppy-modal]"));
    modals.map((s) => s.addEventListener("click", this.modalHandler, false));
  };

  renderSubfeatures = (puppies) => {
    const html = `
      <div class="row justify-content-center">
        ${puppies.map((p) => renderSubfeature(p)).join("")}
      </div>
    `;

    this.subfeaturesEl.innerHTML = html;
  };

  modalHandler = async (e) => {
    e.preventDefault();
    if (e.currentTarget.getAttribute("data-puppy-modal")) {
      const id = e.currentTarget.getAttribute("data-puppy-modal");
      const puppy = this.puppies.find((i) => i.id.toString() === id.toString());
      this.modalContentEl.innerHTML = renderModal(puppy);
      this.modal.show();
    }
  };
}
