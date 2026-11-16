/**
 * Loads the environment configuration selected with `envName` from the `env.config`
 * folder and merges it into the Cypress configuration.
 *
 * @param config The Cypress configuration received by `setupNodeEvents`.
 * @param dir The directory that contains the `env.config` folder (usually `__dirname`).
 * @returns The same configuration object, updated with the environment settings.
 */
export function setCypressEnv<T extends { env?: Record<string, any>; expose?: Record<string, any> }>(config: T, dir: string): Promise<T>
