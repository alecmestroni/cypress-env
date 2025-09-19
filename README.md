# Cypress plugin to handle multi environment

Easily manage and streamline your Cypress test scripts across multiple environments with the `cypress-env` npm library. This lightweight utility simplifies the process of handling different environments (such as test, staging, and production) by providing environment-specific settings in your Cypress tests.

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

## Table of Contents

- [Install](#install)
- [Configuration](#configuration)
  - [1. Code in `cypress.config.js`](#1-code-in-cypressconfigjs)
  - [2. Create the `env.config` folder](#2-create-the-envconfig-folder)
  - [3. Add your environment JSON files](#3-add-your-environment-json-files)
  - [4. Control Log Verbosity with `ENV_LOG_MODE`](#4-control-log-verbosity-with-env_log_mode)
  - [5. Open or run Cypress with the correct environment variables](#5-open-or-run-cypress-with-the-correct-environment-variables)
- [Shared Configurations Feature](#shared-configurations-feature)
- [Configuration Priority Order](#configuration-priority-order)
- [Results example](#results-example)
  - [Correct configuration](#correct-configuration)
  - [Correct configuration with shared settings](#correct-configuration-with-shared-settings)
  - [No configuration specified](#no-configuration-specified)
  - [Wrong configuration (missing `__dirname`)](#wrong-configuration-missing-__dirname)
- [Little tip for you](#little-tip-for-you)
- [Compatibility with cypress-aws-secrets-manager](#compatibility-with-cypress-aws-secrets-manager)

---

## Install

```shell
$ npm install cypress-env --save-dev
```

or as a global module

```shell
$ npm install -g cypress-env
```

## Configuration

### 1. Code in `cypress.config.js`

In your `cypress.config.js` file:

```js
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-env")(on, config, __dirname)
    },
  },
})
```

### 2. Create the `env.config` folder

Then configure a folder named `env.config` with your environments JSON files:

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

### 3. Add your environment JSON files

JSON files must respect this syntax:

```json
// environment.json
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

| Parameter          | Mandatory | Overwrites value in `cypress.config.js` | Notes                                                                   |
| ------------------ | --------- | --------------------------------------- | ----------------------------------------------------------------------- |
| baseUrl            | FALSE     | TRUE                                    | Overwrites value in `cypress.config.js`                                 |
| specPattern        | FALSE     | TRUE                                    | Overwrites value in `cypress.config.js`                                 |
| excludeSpecPattern | FALSE     | TRUE                                    | Overwrites value in `cypress.config.js`                                 |
| supportFile        | FALSE     | TRUE                                    | Requires supportFile in the main e2e or component object set to `false` |
| shared             | FALSE     | N/A                                     | Boolean: enables loading of shared configurations from `_shared.json`   |
| env                | FALSE     | FALSE                                   | Merged into `env` object in `cypress.config.js`                         |

### 4. Control Log Verbosity with `ENV_LOG_MODE`

The plugin supports different log modes controlled by the `ENV_LOG_MODE` environment variable. By default, full logs are displayed. To restrict output and show only summary messages, set:

```bash
# Open Cypress in silent mode
npx cypress open -e envName=stage -e ENV_LOG_MODE=silent
```

When `ENV_LOG_MODE` is set to `'silent'`, detailed logs such as configuration extraction paths and parameter listings are suppressed. Only the final success message is shown.

**Default verbose logs**:

```bash
Extracting local configurations from: path/to/environment.json
 - baseUrl: "https://www.google.com"
 - specPattern: "cypress/e2e/**/**.js"
 - excludeSpecPattern: "cypress/e2e/**/toExclude.js"
 - supportFile: "cypress/support/customName.js"
 - env: {
     "var1": "value1",
     "var2": "value2",
     "var3": "value3",
     "envName": "test"
   }

√ Configurations loaded correctly for the environment: < TEST >
```

**Silent mode logs**:

```bash
√ Configurations loaded correctly for the environment: < TEST >
```

### 5. Open or run Cypress with the correct environment variables

Open Cypress and inject the `envName` and optional `ENV_LOG_MODE`:

```bash
npx cypress open -e envName=test
# or silent:
npx cypress open -e envName=test -e ENV_LOG_MODE=silent
```

or run Cypress tests:

```bash
npx cypress run -e envName=test
# or silent:
npx cypress run -e envName=test -e ENV_LOG_MODE=silent
```

## Shared Configurations Feature

You can now use shared configurations across multiple environments! Add a `_shared.json` file in your `env.config` folder to define common settings that can be reused across environments.

**Structure with shared configurations:**

```bash
├── env.config
│   ├── _shared.json    # ← Common configurations
│   ├── test.json
│   ├── stage.json
│   └── prod.json
```

**Example `_shared.json`:**

```json
{
  "viewportWidth": 1920,
  "viewportHeight": 1080,
  "supportFile": "cypress/support/env.js",
  "env": {
    "commonApiUrl": "https://api.example.com",
    "defaultTimeout": 10000,
    "retries": 2,
    "sharedVariable": "This value is shared across environments",
    "specificTestVar": "This value is overwritten buy env configurations"
  }
}
```

**Example environment with shared configurations:**

```json
// test.json
{
  "shared": true,
  "baseUrl": "https://test.example.com",
  "specPattern": ["**/*.test.js"],
  "env": {
    "specificTestVar": "This overrides shared settings"
  }
}
```

When `"shared": true` is set in an environment file:

1. **Shared configurations are loaded first** from `_shared.json`
2. **Environment-specific settings override** shared ones
3. **Environment variables are merged**, with environment-specific taking precedence

## **Configuration Priority Order:**

The plugin respects a strict priority hierarchy when applying configurations:

1. **CLI arguments** (highest priority) - Cannot be overridden
2. **Environment JSON files** - Environment-specific settings
3. **Shared configurations** - Common settings from `_shared.json`
4. **Default config** - Base `cypress.config.js` settings (lowest priority)

This means:

- CLI parameters like `-e var=value` will never be overwritten
- Environment-specific settings always override shared configurations
- Shared configurations override default config values
- The plugin only applies settings that haven't been set by higher priority sources

**Benefits:**

- **Reuse common configurations** across multiple environments
- **Override only what's different** per environment
- **Cleaner environment files** with less duplication
- **Easier maintenance** of shared settings
- **Predictable configuration precedence** with CLI always taking priority

## Results example

### Correct configuration

```bash
====================================================================================================

Starting plugin: cypress-env

Extracting local configurations from: "path/to/environment.json"

 - baseUrl: "https://www.google.com"
 - specPattern: "cypress/e2e/**/**.js"
 - excludeSpecPattern: "cypress/e2e/**/toExclude.js"
 - supportFile: "cypress/support/customName.js"
 - env: "{\n    \"var1\": \"value1\",\n    \"var2\": \"value2\",\n    \"var3\": \"value3\",\n    \"envName\": \"test\"\n  }"

√ Configurations loaded correctly for the environment: < TEST >

====================================================================================================
```

### Correct configuration with shared settings

```bash
====================================================================================================

Starting plugin: cypress-env

Extracting local configurations from: "path/to/test.json"

Loading shared configurations from: "path/to/_shared.json"

 - baseUrl: "https://test.example.com"
 - specPattern: ["**/*.test.js"]
 - viewportWidth: 1920
 - viewportHeight: 1080
 - supportFile: "cypress/support/env.js"
 - env: {
     "commonApiUrl": "https://api.example.com",
     "defaultTimeout": 10000,
     "retries": 2,
     "sharedVariable": "This value is shared across environments",
     "envName": "test",
     "specificTestVar": "This overrides shared settings"
}

√ Configurations loaded correctly for the environment: < TEST > (with shared configurations)

====================================================================================================
```

### No configuration specified

```bash
====================================================================================================

Starting plugin: cypress-env

√ No environment configuration specified, using basic configuration!

====================================================================================================
```

### Wrong configuration (missing `__dirname`)

```bash
====================================================================================================

Starting plugin: cypress-env

ConfigurationError!
You must specify the "__dirname" element in the config, change the require to:
require("cypress-env")(on, config, __dirname)

====================================================================================================
```

## Little tip for you

In your `package.json` file create scripts like this:

```json
// package.json
{
  "scripts": {
    "cy:test": "npx cypress open -e envName=test",
    "cy:stage": "npx cypress open -e envName=stage",
    "cy:prod": "npx cypress open -e envName=prod",
    "cy:stage:silent": "npx cypress open -e envName=stage -e ENV_LOG_MODE=silent"
  }
}
```

So you'll only have to type:

```bash
npm run cy:test
```

## Compatibility with cypress-aws-secrets-manager

[`cypress-aws-secrets-manager`](https://www.npmjs.com/package/cypress-aws-secrets-manager) is a plugin that allows secrets stored in AWS Secrets Manager to be loaded into Cypress as environment variables. To make life easier, you can include the key `AWS_SECRET_MANAGER_CONFIG` inside `env`.

| Parameter                 | Mandatory | Overwrites value in `cypress.config.js` | Notes                                      |
| ------------------------- | --------- | --------------------------------------- | ------------------------------------------ |
| AWS_SECRET_MANAGER_CONFIG | FALSE     | TRUE                                    | Object used by cypress-aws-secrets-manager |

```json
// environment.json
{
  "baseUrl": "https://www.google.com",
  "specPattern": "cypress/e2e/**/**.js",
  "excludeSpecPattern": "cypress/e2e/**/toExclude.js",
  "supportFile": "cypress/support/customName.js",
  "env": {
    "var1": "value1",
    "var2": "value2",
    "var3": "value3",
    "envName": "test",
    "AWS_SECRET_MANAGER_CONFIG": {
      "secretName": "...",
      "profile": "...",
      "region": "..."
    }
  }
}
```

---

## THE JOB IS DONE!

Happy testing to everyone! 🎉

ALEC-JS

<h3 align="center">
🙌 Donate to support my work & further development! 🙌
</h3>

<h3 align="center">
  <a href="https://paypal.me/AlecMestroni?country.x=IT&locale.x=it_IT">
    <img src="https://raw.githubusercontent.com/alecmestroni/cypress-xray-junit-reporter/main/img/badge.svg" width="111" align="center" />
  </a>
</h3>
