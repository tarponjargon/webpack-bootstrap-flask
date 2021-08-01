describe("Favorites page", () => {
  beforeEach(() => {
    cy.request("/api/puppies").then((r) => {
      cy.setLocalStorage("puppies", JSON.stringify(r.body.animals));
      cy.favoriteListen("/favorites");
    });
  });
  it("Test favorites load", function () {
    cy.get("[data-favorite]").should("have.length", 20);
    cy.get('[data-js="fav-count"]').should("have.text", "20");
  });
  it("Test un-favorited", function () {
    cy.get("[data-favorite]")
      .first()
      .invoke("attr", "data-favorite")
      .then((id) => {
        cy.get('[data-js="toast-container"]').then(($toastEl) => {
          cy.get(`[data-favorite="${id}"]`)
            .click({ force: true })
            .then(() => {
              cy.get('[data-js="fav-count"]').should("have.text", "19");
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
