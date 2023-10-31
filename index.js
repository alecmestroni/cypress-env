const chalk = require("chalk");

const separator = chalk.white('\n====================================================================================================\n')

module.exports = (on, config, dir) => {
    if (dir === undefined) {
        console.error(chalk.red('\nConfigurationError:\n') + chalk.yellow('You must specify the "__dirname" element in the config, change the require to: ') + 'require("cypress-xray-junit-reporter/plugin")(on, config, __dirname)')
        throw new Error('You must specify the "__dirname" element in the config, change the require to:\nrequire("cypress-xray-junit-reporter/plugin")(on, config, __dirname)')
    }
    loadLocalENV(config, dir)
    return config;
};

async function getLocalEnv(config, dir) {
    console.log(separator)
    const envName = config.env.envName
    const environmentFilename = dir + `/env.config/${envName}.json`
    console.log(`Extracting local configurations from:` + chalk.cyan(` ${environmentFilename}\n`))
    try {
        const settings = require(environmentFilename)
        const cypressSettings = ['baseUrl', 'specPattern', 'excludeSpecPattern', 'awsObj']
        Object.keys(settings).forEach(item => {
            if (cypressSettings.includes(item)) {
                config[item] = settings[item]
                console.log(` - ${chalk.yellow(item)} : ${JSON.stringify(settings[item], null, 4)}`)
            }
        })
        if (settings.env) {
            config.env = {
                ...settings.env,
                ...config.env,
            }
            console.log(' -' + chalk.yellow(' env ') + `: ${JSON.stringify(config.env, null, 4)}`)
        }
        console.log(chalk.green('\n√ ') + chalk.white('Configurations loaded correctly for the environment: ') + chalk.cyan(`< ${envName.toUpperCase()} >`))
    } catch (err) {
        console.error(err)
    }
}

async function loadLocalENV(config, dir) {
    if (config.env.envName && config.env.envName !== '$ENV' && config.env.envName !== '%ENV%') {
        await getLocalEnv(config, dir)
    } else if (!config.env.envName) {
        console.log(separator)
        console.log(chalk.green('\n√ ') + chalk.white('No environment configuration specified, using basic configuration!'))
    } else if (config.env.envName === '$ENV' && config.env.envName === '%ENV%') {
        console.log('Test configuration Error depencie needed')
    }
}