describe("Cypress Expose", () => {
  // Configurations
  it("should have the correct homepage expose variable", () => {
    expect(Cypress.expose("googleImage")).to.equal("/imghp?hl=en&authuser=0&ogbl")
  })

  it("should have the correct AWS_SSO_STRATEGY expose variable", () => {
    expect(Cypress.expose("AWS_SSO_STRATEGY")).to.equal("unset")
  })

  it("should have the correct AWS_SECRETS_LOCAL_DIR expose variable", () => {
    expect(Cypress.expose("AWS_SECRETS_LOCAL_DIR")).to.equal("aws-secrets")
  })

  it("should have the correct AWS_SECRET_MANAGER_CONFIG expose variable", () => {
    const AWS_SECRET_MANAGER_CONFIG = Cypress.expose("AWS_SECRET_MANAGER_CONFIG")
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

describe("Cypress Expose Priority", () => {
  it("should have the correct everywhere", () => {
    expect(Cypress.expose("everywhere")).to.equal("fromScript")
  })

  it("should have the correct inExpJsonSharedAndConfig", () => {
    expect(Cypress.expose("inExpJsonSharedAndConfig")).to.equal("fromExpJson")
  })
  it("should have the correct inSharedAndConfig", () => {
    expect(Cypress.expose("inSharedAndConfig")).to.equal("fromShared")
  })

  it("should have the correct inConfig", () => {
    expect(Cypress.expose("inConfig")).to.equal("fromConfig")
  })
})
