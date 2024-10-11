describe('Cypress Integrations Tests', () => {
  // Configurations
  it('should have the correct baseUrl', () => {
    expect(Cypress.config('baseUrl')).to.equal('https://www.google.com');
  });

  it('should have the correct specPattern', () => {
    expect(Cypress.config('specPattern')).to.deep.equal(["**/*.env.js"]);
  });

  it('should have the correct excludeSpecPattern', () => {
    expect(Cypress.config('excludeSpecPattern')).to.deep.equal(["**/*.cy.js"]);
  });

  it('should have the correct viewportWidth', () => {
    expect(Cypress.config('viewportWidth')).to.equal(1920);
  });

  it('should have the correct viewportHeight', () => {
    expect(Cypress.config('viewportHeight')).to.equal(1080);
  });

  it('should have the correct supportFile', () => {
    expect(Cypress.config('supportFile')).to.equal("cypress/support/env.js");
  });

  it('should have the correct homepage environment variable', () => {
    expect(Cypress.env('googleImage')).to.equal('/imghp?hl=en&authuser=0&ogbl');
  });

  it('should have the correct AWS_SSO_STRATEGY environment variable', () => {
    expect(Cypress.env('AWS_SSO_STRATEGY')).to.equal('unset');
  });

  it('should have the correct AWS_SECRETS_LOCAL_DIR environment variable', () => {
    expect(Cypress.env('AWS_SECRETS_LOCAL_DIR')).to.equal('aws-secrets');
  });

  it('should have the correct AWS_SECRET_MANAGER_CONFIG environment variable', () => {
    const AWS_SECRET_MANAGER_CONFIG = Cypress.env('AWS_SECRET_MANAGER_CONFIG');
    expect(AWS_SECRET_MANAGER_CONFIG).to.have.property('secretName', 'secretName');
    expect(AWS_SECRET_MANAGER_CONFIG).to.have.property('region', 'region');
  });
  it('should imported the correct custom commands', () => {
    cy.visitGoogleImage()
    cy.url().then(url => {
      expect(url).to.equal('https://www.google.com/imghp?hl=en&authuser=0&ogbl');
    })
  });

});