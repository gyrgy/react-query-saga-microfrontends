type RemoteModule = {
  default: React.ComponentType;
};

type LoadRemoteFunction = <T>(
  id: string,
  options?: { loadFactory?: boolean; from: "build" | "runtime" }
) => Promise<T | null>;

type CreateModuleLoaderOptions = {
  loadRemote: LoadRemoteFunction;
  sentryCapture?: (error: Error, context?: Record<string, any>) => void;
};

export const createModuleLoader = ({
  loadRemote,
  sentryCapture = (error: Error) => console.error(error),
}: CreateModuleLoaderOptions) => {
  return async function loadModule(
    fullModulePath: string,
    retries = 3
  ): Promise<RemoteModule> {
    try {
      const module = await loadRemote<RemoteModule>(fullModulePath, {
        from: "runtime",
      });
      if (!module || !module.default) {
        throw new Error(`Failed to load module: ${fullModulePath}`);
      }
      return module;
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `Retrying to load module: ${fullModulePath}. Attempts left: ${retries - 1}`
        );
        return loadModule(fullModulePath, retries - 1);
      }

      sentryCapture(error as Error, {
        tags: {
          moduleLoader: fullModulePath,
        },
      });

      if (error instanceof Error) {
        if (error.message.includes("Network Error")) {
          throw new Error(
            `Network error while loading module: ${fullModulePath}`
          );
        } else if (error.message.includes("Module not found")) {
          throw new Error(`Module not found: ${fullModulePath}`);
        }
      }

      throw error;
    }
  };
};
