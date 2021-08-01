describe("Detail page", () => {
  beforeEach(function () {
    cy.request("/api/randompuppy").then((r) => {
      cy.favoriteListen(`/puppy/${r.body.id}`);
    });
  });
  it("Test images load", function () {
    cy.get('[data-test="image"] img')
      .first()
      .should("exist")
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });
    cy.get('[data-test="slide"]').should("have.length.above", 2);
    cy.get('[data-test="slide"]').each((img) => {
      cy.wrap(img)
        .should("exist")
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
  });
  it("Test detail favorite", function () {
    cy.favorite('[data-test="detail"] [data-favorite]');
  });
  it("Test suggestions favorite", function () {
    cy.get('[data-js="suggestions-container"] [data-favorite]');
  });
});
