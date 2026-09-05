import {
  configAuth,
  type AuthConfigurations,
  type AuthInstance
} from "./config";

export type { AuthInstance };

let authInstance: AuthInstance;

/**
 * Sets up the authentication instance with the provided configuration.
 * This function should be called once during application initialization.
 *
 * @param config - The authentication configuration.
 */
export function setupAuth(config: AuthConfigurations) {
  if (authInstance) {
    console.log("[Auth Setup] Reusing existing auth instance (module-level cache)");
    return authInstance;
  }

  console.log("[Auth Setup] Creating new auth instance", {
    hasDatabase: !!config.database,
    hasSecret: !!config.secret,
    secretLength: config.secret?.length
  });

  authInstance = configAuth(config);
  return authInstance;
}

/**
 * Gets the initialized authentication instance.
 * Throws an error if the instance has not been set up yet.
 */
export function getAuth(): AuthInstance {
  if (!authInstance) {
    throw new Error("Auth instance not initialized.");
  }

  return authInstance;
}
