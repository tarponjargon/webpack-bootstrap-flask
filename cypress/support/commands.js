import "cypress-localstorage-commands";

Cypress.Commands.add("favoriteListen", (url) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      // set up listener for app's custom 'favoriteadded' event
      win.addFavorite = () => {};
      cy.spy(win, "addFavorite").as("favoriteAdded");
      win.document.addEventListener("favoriteadded", win.addFavorite);

      // set up listener for app's custom 'favoriteremoved' event
      win.removeFavorite = () => {};
      cy.spy(win, "removeFavorite").as("favoriteRemoved");
      win.document.addEventListener("favoriteremoved", win.removeFavorite);
    },
  });
});

Cypress.Commands.add("favorite", (selector) => {
  cy.get(selector)
    .first()
    .invoke("attr", "data-favorite")
    .then((id) => {
      cy.get('[data-js="toast-container"]').then(($toastEl) => {
        // add favorite
        cy.get(`[data-favorite="${id}"]`)
          .click({ force: true })
          .then(() => {
            cy.get('[data-js="fav-count"]').should("have.text", "1");
            expect($toastEl.css("visibility")).to.eq("visible");
            expect($toastEl.text()).to.contain("Favorite added");
            cy.get("@favoriteAdded").should("be.calledOnce");

            cy.getLocalStorage("puppies").then((str) => {
              const puppies = JSON.parse(str);
              const puppy = puppies.find((i) => i.id.toString() === id);
              expect(puppy.id.toString()).to.eq(id);
            });
          });

        // remove favorite
        cy.get(`[data-favorite="${id}"]`)
          .click({ force: true })
          .then(() => {
            cy.get('[data-js="fav-count"]').should("have.text", "0");
            expect($toastEl.css("visibility")).to.eq("visible");
            expect($toastEl.text()).to.contain("Favorite removed");
            cy.get("@favoriteRemoved").should("be.calledOnce");

            cy.getLocalStorage("puppies").then((str) => {
              const puppies = JSON.parse(str);
              const puppy = puppies.find((i) => i.id.toString() === id);
              expect(puppy).to.be.undefined;
            });
          });
      });
    });
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
