const chalk = require('chalk')

const separator = chalk.grey('\n====================================================================================================\n')

module.exports = (on, config, dir) => {
  console.log(separator)
  console.log('Starting plugin: ' + chalk.green('cypress-env\n'))
  if (dir === undefined) {
    console.log(
      chalk.red('ConfigurationError!\n') +
        chalk.yellow('You must specify the "__dirname" element in the config, change the require to: \n') +
        'require("cypress-env")(on, config, __dirname)'
    )
    console.log(separator)
    throw new Error('You must specify the "__dirname" element in the config, change the require to:\nrequire("cypress-env")(on, config, __dirname)')
  }
  loadLocalENV(config, dir)
  return config
}

async function getLocalEnv(config, dir) {
  const envName = config.env.envName
  const environmentFilename = dir + `/env.config/${envName}.json`
  console.log(`Extracting local configurations from:` + chalk.cyan(` ${environmentFilename}\n`))
  try {
    const settings = require(environmentFilename)
    const cypressSettings = require('./cySettings.json')
    Object.keys(settings).forEach((item) => {
      if (cypressSettings.settings.includes(item) && config?.resolved?.[item]?.from !== 'config' && !config.resolved[item].item) {
        config[item] = settings[item]
        if (config.env.ENV_LOG_MODE !== 'silent') console.log(`${chalk.yellow(item)} : ${JSON.stringify(settings[item], null, 1)}`)
      }
    })
    if (settings.env) {
      config.env = {
        ...settings.env,
        ...config.env,
      }
      if (config.env.ENV_LOG_MODE !== 'silent') console.log(chalk.yellow('env ') + `: ${JSON.stringify(config.env, null, 1)}\n`)
    }
    console.log(chalk.green('√ ') + chalk.white('Configurations loaded correctly for the environment: ') + chalk.cyan(`< ${envName.toUpperCase()} >`))
  } catch (err) {
    console.error(err)
  }
}

async function loadLocalENV(config, dir) {
  if (config.env.envName && config.env.envName !== '$ENV' && config.env.envName !== '%ENV%') {
    await getLocalEnv(config, dir)
  } else if (!config.env.envName) {
    console.log(chalk.green('√ ') + chalk.white('No environment configuration specified, using basic configuration!'))
  } else if (config.env.envName === '$ENV' && config.env.envName === '%ENV%') {
    console.log('Test configuration error dependency needed: cypress-env not configured correctly')
  }
}
