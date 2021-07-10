import { ScrollSpy } from "bootstrap";

export default class Globals {
  constructor() {}

  init = () => {
    this.navbarShrink();
    this.mainNavScrollspy();
    this.toggleNavbar();
    document.addEventListener("scroll", this.navbarShrink);
  };

  navbarShrink = () => {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) return;
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  mainNavScrollspy = () => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector("#mainNav");
    if (mainNav) {
      new ScrollSpy(document.body, {
        target: "#mainNav",
        offset: 72,
      });
    }
  };

  toggleNavbar = () => {
    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector(".navbar-toggler");
    const responsiveNavItems = [].slice.call(
      document.querySelectorAll("#navbarResponsive .nav-link")
    );
    responsiveNavItems.map(function (responsiveNavItem) {
      responsiveNavItem.addEventListener("click", () => {
        if (window.getComputedStyle(navbarToggler).display !== "none") {
          navbarToggler.click();
        }
      });
    });
  };
} // end Globals class def
