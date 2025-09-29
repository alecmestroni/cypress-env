const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      const { setCypressEnv } = require("cypress-env")
      config = await setCypressEnv(config, __dirname)
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
