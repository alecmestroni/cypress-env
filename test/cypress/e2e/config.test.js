describe("Cypress Config", () => {
  // Configurations
  it("should have the correct baseUrl", () => {
    expect(Cypress.config("baseUrl")).to.equal("https://www.fromScript.com")
  })

  it("should have the correct specPattern", () => {
    expect(Cypress.config("specPattern")).to.deep.equal(["**/*.test.js"])
  })

  it("should have the correct excludeSpecPattern", () => {
    expect(Cypress.config("excludeSpecPattern")).to.deep.equal(["**/*.cy.js"])
  })

  it("should have the correct viewportWidth", () => {
    expect(Cypress.config("viewportWidth")).to.equal(1920)
  })

  it("should have the correct viewportHeight", () => {
    expect(Cypress.config("viewportHeight")).to.equal(1080)
  })

  it("should have the correct supportFile", () => {
    expect(Cypress.config("supportFile")).to.equal("cypress/support/env.js")
  })
})
describe("Cypress Config Priority", () => {
  // should be passed a valid value for cypress.config from the script
  it("should have the correct everywhere", () => {
    expect(Cypress.config("baseUrl")).to.equal("https://www.fromScript.com")
  })
  it("should have the correct inSharedAndConfig", () => {
    expect(Cypress.config("excludeSpecPattern")).to.deep.equal(["**/*.cy.js"])
  })

  // Only in env.json and _shared.json
  it("should have the correct inEnvJsonSharedAndConfig", () => {
    expect(Cypress.config("fixturesFolder")).to.equal("fromEnvJson")
  })

  it("should have the correct inConfig", () => {
    expect(Cypress.config("fileServerFolder")).to.equal("fromShared")
  })
})
