import { scrollToEl } from "../modules/Utils";

export default class Contact {
  constructor() {
    this.successEl = document.getElementById("submit-success-message");
    this.errorEl = document.getElementById("submit-error-message");
  }

  init = () => {
    return new Promise((resolve) => {
      document.addEventListener("submit", this.submitForm, false);
      resolve();
    });
  };

  submitForm = async (e) => {
    e.preventDefault();

    const formEl = e.target;

    // reset message containers
    this.successEl.classList.add("d-none");
    this.errorEl.classList.add("d-none");

    const data = new FormData(formEl);
    const response = await fetch("/api/contact", {
      body: data,
      method: "post",
    });
    const result = await response.json();

    if (result.success) {
      scrollToEl("body");
      this.successEl.classList.remove("d-none");
      formEl.classList.add("d-none");
    } else {
      this.errorEl.querySelector('[data-js="error-message"]').innerText = result.message;
      this.errorEl.classList.remove("d-none");
    }
  };
}
