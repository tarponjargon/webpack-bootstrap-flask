import { Toast } from "bootstrap";

export default class myToast {
  constructor(delay = 2000) {
    this.toastEl = document.querySelector(".toast");
    this.toastText = this.toastEl.querySelector(".toast-body");
    this.toast = new Toast(this.toastEl, { delay });
  }

  show = (message) => {
    this.toastText.innerText = message;
    this.toast.show();
  };
}
