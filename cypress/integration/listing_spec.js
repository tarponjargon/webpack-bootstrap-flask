describe("Listing page", () => {
  beforeEach(() => {
    cy.visit("/puppies", {
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
  it("Test list items load", function () {
    cy.get('[data-test="list-item"]').should("have.length", 20);
  });
  it("Test pagination", function () {
    cy.get('[data-test="next"]').first().click();
    cy.url().should("contain", "page=2");
  });
  it("Test state filter", function () {
    // add filter
    cy.get('select[name="location"]').select("Alabama");
    cy.url().should("contain", "location=AL");
    cy.get('[data-test-state="AL"]').should("have.length", 20);

    // remove filter
    cy.get('[data-test-reset="location"]').click({ force: true });
    cy.url().should("not.contain", "location=AL");
    cy.get('[data-test-state="AL"]').should("have.length.below", 20);
  });
  it("Test favoriting", function () {
    cy.get("[data-favorite]")
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
});
