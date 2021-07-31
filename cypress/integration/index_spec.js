describe("Home page", () => {
  beforeEach(function () {
    cy.visit("/");
  });
  it("Test features load", function () {
    cy.get('[data-test="slide"]').should("have.length.above", 10);
  });
  it("Test sub features", function () {
    cy.visit("/");
    cy.get("[data-puppy-modal]").should("have.length", 6);
  });
  it("Test modal", function () {
    cy.visit("/");
    cy.get("[data-puppy-modal] [data-test='name']")
      .first()
      .invoke("text")
      .then((name) => {
        cy.get("[data-puppy-modal]").first().click();
        cy.get("#modal-title").should("contain", name);
      });
  });
});
