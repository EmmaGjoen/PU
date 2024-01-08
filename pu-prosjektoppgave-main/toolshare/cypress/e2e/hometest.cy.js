describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('localhost:3000')
    })
  
    context("visit the different pages and check values", () => {
  
      it('should have a title', () => {
        cy.get("[class='nav-p']").should('contain', 'ToolShare')
  
      })
  
      it("Visit the message page", () => {
        cy.get("[class='messages-button']").click()
        cy.location("pathname").should("eq", "/messages")
      })
  
      it("Visit the about page", () => {
        cy.get("[class='about-button']").click()
        cy.location("pathname").should("eq", "/about")
        cy.get("[class='about-header']").should('contain', 'Toolshare is a tool rental site')
        cy.get("[class='creators']").should('contain', 'Created by: Emma, Kaisa, Markus, John, Lars Martin, Tobias')
      })
  
      it("Visit the login page", () => {
          cy.get("[class='login-button']").click()
          cy.location("pathname").should("eq", "/login")
        })
  
      it("Visit the create listing page", () => {
            cy.get("[class='createlisting-button']").click()
            cy.location("pathname").should("eq", "/createlisting")
        })
  
      it("Visit the home page", () => {
          cy.get("[class='home-button']").click()
          cy.location("pathname").should("eq", "/")
      })
  
  })
  
  })