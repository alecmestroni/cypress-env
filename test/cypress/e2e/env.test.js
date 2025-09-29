describe("Cypress Environment", () => {
  // Configurations
  it("should have the correct homepage environment variable", () => {
    expect(Cypress.env("googleImage")).to.equal("/imghp?hl=en&authuser=0&ogbl")
  })

  it("should have the correct AWS_SSO_STRATEGY environment variable", () => {
    expect(Cypress.env("AWS_SSO_STRATEGY")).to.equal("unset")
  })

  it("should have the correct AWS_SECRETS_LOCAL_DIR environment variable", () => {
    expect(Cypress.env("AWS_SECRETS_LOCAL_DIR")).to.equal("aws-secrets")
  })

  it("should have the correct AWS_SECRET_MANAGER_CONFIG environment variable", () => {
    const AWS_SECRET_MANAGER_CONFIG = Cypress.env("AWS_SECRET_MANAGER_CONFIG")
    expect(AWS_SECRET_MANAGER_CONFIG).to.have.property("secretName", "secretName")
    expect(AWS_SECRET_MANAGER_CONFIG).to.have.property("region", "region")
  })
  it("should imported the correct custom commands", () => {
    cy.visitGoogleImage()
    cy.url().then((url) => {
      expect(url).to.equal("https://www.fromscript.com/imghp?hl=en&authuser=0&ogbl")
    })
  })
})
describe("Cypress Environment Priority", () => {
  it("should have the correct everywhere", () => {
    expect(Cypress.env("everywhere")).to.equal("fromScript")
  })

  it("should have the correct inEnvJsonSharedAndConfig", () => {
    expect(Cypress.env("inEnvJsonSharedAndConfig")).to.equal("fromEnvJson")
  })
  it("should have the correct inSharedAndConfig", () => {
    expect(Cypress.env("inSharedAndConfig")).to.equal("fromShared")
  })

  it("should have the correct inConfig", () => {
    expect(Cypress.env("inConfig")).to.equal("fromConfig")
  })
})
