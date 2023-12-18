# Cypress plugin to handle multi environment

Easily manage and streamline your Cypress test scripts across multiple environments with the cypress-env npm library. This lightweight utility simplifies the process of handling different environments (such as test, staging, and production) by providing a environment-specific settings in your Cypress tests.

<h3 align="center">
  <a href="https://www.npmjs.com/package/cypress-env">
    <img src="https://img.shields.io/npm/v/cypress-env" align="center" />
  </a>
  <a href="https://www.npmjs.com/package/cypress-env">
    <img src="https://img.shields.io/npm/dm/cypress-env"  align="center" />
  </a>
  <a href="https://paypal.me/AlecMestroni?country.x=IT&locale.x=it_IT">
      <img src="https://raw.githubusercontent.com/alecmestroni/cypress-xray-junit-reporter/main/img/badge.svg" align="center" />
  </a>
</h3>

## Install

```shell
$ npm install cypress-env --save-dev
```

or as a global module

```shell
$ npm install -g cypress-env
```

## Configuration

### Code in cypress.config.js:

In your cypress.config.js file:

```
module.exports = defineConfig({
 e2e: {
  setupNodeEvents(on, config) {
   require('cypress-xray-junit-reporter/plugin')(on, config, __dirname)
  },
 },
})
```

### Create the env.config folder:

Then configure a folder named `env.config' with your environments.json files:

```bash
├── cypress
│   ├── e2e
│   ├── fixtures
│   └── support
├── cypress.config.js
├── env.config
│   ├── test.json
│   ├── stage.json
│   └── prod.json
├── node_modules
├── README.md
├── package-lock.json
├── package.json
└── .gitignore
```

### Add your environment.json files:

JSON files must respect this syntax:

```json
//environment.json
{
  "baseUrl": "https://www.google.com",
  "specPattern": "cypress/e2e/**/**.js",
  "excludeSpecPattern": "cypress/e2e/**/toExclude.js",
  "supportFile": "cypress/support/customName.js",
  "env": {
    "var1": "value1",
    "var2": "value2",
    "var3": "value3",
    "envName": "environment"
  }
}
```

| Parameter               | Mandatory | Overwrites value in cypress.config.js | Notes                                                                               |
| ----------------------- | --------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| baseUrl                 | FALSE     | TRUE                                  | Overwrites value in cypress.config.js                                               |
| specPattern             | FALSE     | TRUE                                  | Overwrites value in cypress.config.js                                               |
| excludeSpecPattern      | FALSE     | TRUE                                  | Overwrites value in cypress.config.js                                               |
| supportFile             | FALSE     | TRUE                                  | Needs the parameters "supportFile" in the main e2e or component object set to false |
| env                     | FALSE     | FALSE                                 | OBJ added to values in cypress.config.js                                            |
| awsSecretsManagerConfig | FALSE     | TRUE                                  | OBJ used by cypress-aws-secrets-manager                                             |

### Open or run cypress with the correct environment variables:

Open cypress and inject the envName variables:

```bash
npx cypress open -e envName=test
```

or run cypress and inject the envName variables:

```bash
npx cypress run -e envName=test
```

## Results example

### Correct configuration

```bash
====================================================================================================

Starting plugin: cypress-env

Extracting local configurations from: "path/to/environment.json"

 - baseUrl: "https://www.google.com"
 - specPattern: "cypress/e2e/**/**.js"
 - excludeSpecPattern: "cypress/e2e/**/toExclude.js",
 - supportFile: "cypress/support/customName.js",
 - env: "{
    "var1": "value1",
    "var2": "value2",
    "var3": "value3",
    "envName": "test"
}"

√ Configurations loaded correctly for the environment: < TEST >

====================================================================================================
```

### No configuration specified

```bash
====================================================================================================

Starting plugin: cypress-env

√ No environment configuration specified, using basic configuration!

====================================================================================================
```

### Wrong configuration (missing \_\_dirname)

```bash
====================================================================================================

Starting plugin: cypress-env

ConfigurationError!
You must specify the "__dirname" element in the config, change the require to:
require("cypress-xray-junit-reporter/plugin")(on, config, __dirname)

====================================================================================================
```

## Little tip for you

In your package.json file create a script like this:

```json
//package.json
{
  "scripts": {
    "cy:test": "npx cypress open -e envName=test",
    "cy:stage": "npx cypress open -e envName=stage",
    "cy:prod": "npx cypress open -e envName=prod"
  }
}
```

So you'll only have to type this command to open cypress in the correct environment:

```bash
npm run cy:test
```

#

### Compatibility with cypress-aws-secrets-manager

["cypress-aws-secrets-manager"](https://www.npmjs.com/package/cypress-aws-secrets-manager) is a plugin that allows a secret stored in the AWS secret manager to be loaded into cypress as an environment variable.
To make life easier I added a new key: awsSecretsManagerConfig.

| Parameter               | Mandatory | Overwrites value in cypress.config.js | Notes                                   |
| ----------------------- | --------- | ------------------------------------- | --------------------------------------- |
| awsSecretsManagerConfig | FALSE     | TRUE                                  | OBJ used by cypress-aws-secrets-manager |

The secret manager plugin will automatically handle this obj to recover the secret archived on AWS secret manager.

```json
//environment.json
{
  "baseUrl": "https://www.google.com",
  "specPattern": "cypress/e2e/**/**.js",
  "excludeSpecPattern": "cypress/e2e/**/toExclude.js",
  "supportFile": "cypress/support/customName.js",
  "env": {
    "var1": "value1",
    "var2": "value2",
    "var3": "value3",
    "envName": "test"
  },
  "awsSecretsManagerConfig": {
    "secretName": "...",
    "profile": "...",
    "region": "..."
  }
}
```

## THE JOB IS DONE!

Happy testing to everyone!

ALEC-JS

<h3 align="center">
🙌 Donate to support my work & further development! 🙌
</h3>

<h3 align="center">
  <a href="https://paypal.me/AlecMestroni?country.x=IT&locale.x=it_IT">
    <img src="https://raw.githubusercontent.com/alecmestroni/cypress-xray-junit-reporter/main/img/badge.svg" width="111" align="center" />
  </a>
</h3>
