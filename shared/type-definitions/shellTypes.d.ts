// Shell Module Declarations - Ambient declarations for Module Federation

declare module "shell/queryClient" {
  type StrictQueryKey =
    import("../interfaces/queryClient.interface").StrictQueryKey;
  type IQueryClient =
    import("../interfaces/queryClient.interface").IQueryClient;

  // Query Client API - only what other apps need
  export const fetchData: IQueryClient["fetchData"];
  export const mutateData: IQueryClient["mutateData"];
  export const invalidateCache: IQueryClient["invalidateCache"];
  export const removeCache: IQueryClient["removeCache"];
  export const getCache: IQueryClient["getCache"];
  export const setCache: IQueryClient["setCache"];
}

declare module "shell/ThemeProvider" {
  interface ThemeContext {
    themeMode: "light" | "dark";
    theme: import("@mui/material/styles").Theme;
    toggleTheme: () => void;
  }

  interface ProviderProps {
    children: React.ReactNode;
  }

  const ThemeProvider: React.ComponentType<ProviderProps>;
  export const useThemeContext: () => ThemeContext;
  export default ThemeProvider;
}

declare module "shell/useAppSelector" {
  export const useAppSelector: (typeof import("../../apps/shell-app/src/store/hooks"))["useAppSelector"];
}

declare module "shell/useAppDispatch" {
  export const useAppDispatch: (typeof import("../../apps/shell-app/src/store/hooks"))["useAppDispatch"];
}

declare module "shell/actions" {
  export const getTodosSaga: (typeof import("../../apps/shell-app/src/store/exposedActions/exposedActions"))["getTodosSaga"];
}
