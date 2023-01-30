describe("Contact page", () => {
  beforeEach(function () {
    cy.visit("/contact");
  });
  it("Test form success", function () {
    cy.get("#name").type("ned");
    cy.get("#email").type("test@test.com");
    cy.get("#phone").type("312-588-2300");
    cy.get("#message").type("test message");
    cy.get("#contact-form button").click();
    cy.get("#submit-success-message").should("be.visible").and("contain", "Thanks");
    cy.get("#contact-form").should("not.be.visible");
  });
  it("Test form fail", function () {
    cy.get("#name").type("ned");
    cy.get("#email").type("test@test.com");
    cy.get("#phone").type("abcdefg");
    cy.get("#message").type("test message");
    cy.get("#contact-form button").click();
    cy.get("#submit-error-message").should("be.visible").and("contain", "valid phone");
    cy.get("#contact-form").should("be.visible");
  });
});
