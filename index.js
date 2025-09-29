const chalk = require("chalk")

const separator = chalk.grey("\n====================================================================================================\n")

module.exports = { setCypressEnv }

async function setCypressEnv(config, dir) {
  console.log(separator)
  console.log("Starting plugin: " + chalk.green("cypress-env\n"))
  if (dir === undefined) {
    console.log(
      chalk.red("ConfigurationError!\n") +
        chalk.yellow('You must specify the "__dirname" element in the config, change the require to: \n') +
        chalk.cyan('      const { setCypressEnv } = require("cypress-env")\n') +
        chalk.cyan("      config = await setCypressEnv(config, __dirname)\n") +
        chalk.cyan("      return config")
    )
    console.log(separator)
    throw new Error(
      'You must specify the "__dirname" element in the config, change the require to:\n      const { setCypressEnv } = require("cypress-env")\n      config = await setCypressEnv(config, __dirname)\n      return config'
    )
  }
  await loadLocalENV(config, dir)
  return config
}

async function getSharedConfig(config, dir) {
  const sharedFilename = dir + `/env.config/_shared.json`
  try {
    console.log(`Loading shared configurations from:` + chalk.cyan(` ${sharedFilename}\n`))
    const sharedSettings = require(sharedFilename)
    return sharedSettings
  } catch (err) {
    console.log(chalk.yellow("No shared configuration file found, skipping shared settings!"))
    return {}
  }
}

async function getLocalEnv(config, dir) {
  const envName = config.env.envName
  const environmentFilename = dir + `/env.config/${envName}.json`
  console.log(`Extracting local configurations from:` + chalk.cyan(` ${environmentFilename}\n`))
  try {
    const settings = require(environmentFilename)
    const cypressSettings = require("./cySettings.json")

    // Initialize merged settings with shared configurations if enabled
    let mergedSettings = {}
    if (settings.shared === true) {
      const sharedSettings = await getSharedConfig(config, dir)
      mergedSettings = { ...sharedSettings }
    }

    // Merge environment-specific settings over shared settings
    const { env: sharedEnv, ...otherSharedSettings } = mergedSettings
    const { env: envSettings, ...otherEnvSettings } = settings

    mergedSettings = {
      ...(otherSharedSettings ?? {}),
      ...(otherEnvSettings ?? {}),
      env: {
        ...(sharedEnv ?? {}),
        ...(envSettings ?? {}),
      },
    }

    // Apply configurations to Cypress config
    Object.keys(mergedSettings).forEach((item) => {
      if (item !== "shared" && cypressSettings.settings.includes(item) && config?.resolved?.[item]?.from !== "cli") {
        config[item] = mergedSettings[item]
        if (config.env.ENV_LOG_MODE !== "silent") console.log(`${chalk.yellow(item)} : ${JSON.stringify(mergedSettings[item], null, 1)}`)
      }
    })

    // Handle environment variables
    if (mergedSettings.env) {
      Object.keys(mergedSettings.env).forEach((envKey) => {
        if (config?.resolved?.env?.[envKey]?.from !== "cli") {
          config.env[envKey] = mergedSettings.env[envKey]
        }
      })
      if (config.env.ENV_LOG_MODE !== "silent") {
        console.log(chalk.yellow("env ") + `: ${JSON.stringify(config.env, null, 1)}\n`)
      }
    }

    const sharedText = settings.shared === true ? " (with shared configurations)" : ""
    console.log(
      chalk.green("√ ") +
        chalk.white("Configurations loaded correctly for the environment: ") +
        chalk.cyan(`< ${envName.toUpperCase()} >${sharedText}`)
    )
  } catch (err) {
    console.error(err)
  }
}

async function loadLocalENV(config, dir) {
  if (config.env.envName && config.env.envName !== "$ENV" && config.env.envName !== "%ENV%") {
    await getLocalEnv(config, dir)
  } else if (!config.env.envName) {
    console.log(chalk.green("√ ") + chalk.white("No environment configuration specified, using basic configuration!"))
  } else if (config.env.envName === "$ENV" && config.env.envName === "%ENV%") {
    console.log("Test configuration error dependency needed: cypress-env not configured correctly")
  }
}
