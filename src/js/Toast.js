import { Toast } from "bootstrap";

export default class myToast {
  constructor(delay = 2000) {
    this.container = document.querySelector('[data-js="toast-container"]');
    this.toastEl = this.container.querySelector('[data-js="toast"]');
    this.toastText = this.container.querySelector('[data-js="toast-body"]');
    this.toast = new Toast(this.toastEl, { delay });
    this.hideListener();
  }

  removeBackground = () => {
    this.toastEl.classList.remove("bg-primary", "bg-danger", "bg-success");
  };

  danger = (message) => {
    this.show(message, "bg-danger");
  };

  success = (message) => {
    this.show(message, "bg-success");
  };

  show = (message, bgClass = "bg-primary") => {
    this.removeBackground();
    this.toastEl.classList.add(bgClass);
    this.container.style.visibility = "visible";
    this.toastText.innerText = message;
    this.toast.show();
  };

  hideListener = () => {
    this.toastEl.addEventListener("hidden.bs.toast", () => {
      this.container.style.visibility = "hidden";
    });
  };
}
