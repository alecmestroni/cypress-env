// `Cypress.env()` is deprecated since Cypress 15.10.0 and removed in Cypress 16:
// values merged into `env` by cypress-env are read with the async `cy.env()` command.
describe("Cypress Environment", () => {
  // Configurations
  it("should have the correct homepage environment variable", () => {
    cy.env(["googleImage"]).then(({ googleImage }) => {
      expect(googleImage).to.equal("/imghp?hl=en&authuser=0&ogbl")
    })
  })

  it("should have the correct AWS_SSO_STRATEGY environment variable", () => {
    cy.env(["AWS_SSO_STRATEGY"]).then(({ AWS_SSO_STRATEGY }) => {
      expect(AWS_SSO_STRATEGY).to.equal("unset")
    })
  })

  it("should have the correct AWS_SECRETS_LOCAL_DIR environment variable", () => {
    cy.env(["AWS_SECRETS_LOCAL_DIR"]).then(({ AWS_SECRETS_LOCAL_DIR }) => {
      expect(AWS_SECRETS_LOCAL_DIR).to.equal("aws-secrets")
    })
  })

  it("should have the correct AWS_SECRET_MANAGER_CONFIG environment variable", () => {
    cy.env(["AWS_SECRET_MANAGER_CONFIG"]).then(({ AWS_SECRET_MANAGER_CONFIG }) => {
      expect(AWS_SECRET_MANAGER_CONFIG).to.have.property("secretName", "secretName")
      expect(AWS_SECRET_MANAGER_CONFIG).to.have.property("region", "region")
    })
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
    cy.env(["everywhere"]).then(({ everywhere }) => {
      expect(everywhere).to.equal("fromScript")
    })
  })

  it("should have the correct inEnvJsonSharedAndConfig", () => {
    cy.env(["inEnvJsonSharedAndConfig"]).then(({ inEnvJsonSharedAndConfig }) => {
      expect(inEnvJsonSharedAndConfig).to.equal("fromEnvJson")
    })
  })

  it("should have the correct inSharedAndConfig", () => {
    cy.env(["inSharedAndConfig"]).then(({ inSharedAndConfig }) => {
      expect(inSharedAndConfig).to.equal("fromShared")
    })
  })

  it("should have the correct inConfig", () => {
    cy.env(["inConfig"]).then(({ inConfig }) => {
      expect(inConfig).to.equal("fromConfig")
    })
  })

  it("should read several variables at once", () => {
    cy.env(["everywhere", "inConfig", "notDefined"]).then((env) => {
      expect(env.everywhere).to.equal("fromScript")
      expect(env.inConfig).to.equal("fromConfig")
      expect(env.notDefined).to.equal(undefined)
    })
  })
})
