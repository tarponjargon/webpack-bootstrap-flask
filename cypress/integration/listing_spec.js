describe("Listing page", () => {
  beforeEach(() => {
    cy.favoriteListen("/puppies");
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
    cy.favorite("[data-favorite]");
  });
});
