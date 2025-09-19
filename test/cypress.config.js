const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      require("cypress-env")(on, config, __dirname)
      return config
    },
  },
  env: {
    everywhere: "fromConfig",
    inEnvJsonSharedAndConfig: "fromConfig",
    inSharedAndConfig: "fromConfig",
    inConfig: "fromConfig",
  },
})
