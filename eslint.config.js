const path = require("path");
const globals = require("globals");

const GLOBALS_BROWSER_FIX = {
  ...globals.browser,
  AudioWorkletGlobalScope: globals.browser["AudioWorkletGlobalScope "],
};
delete GLOBALS_BROWSER_FIX["AudioWorkletGlobalScope "];

function createAppConfig(appContext = __dirname, overrides = []) {
  return [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      languageOptions: {
        parser: require("@typescript-eslint/parser"),
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          project: path.resolve(appContext, "tsconfig.json"),
        },
        globals: {
          ...GLOBALS_BROWSER_FIX,
          ...globals.node,
          jest: "readonly",
        },
      },
      plugins: {
        "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        react: require("eslint-plugin-react"),
        "react-hooks": require("eslint-plugin-react-hooks"),
        import: require("eslint-plugin-import"),
      },

      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          node: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
          },
          typescript: {
            alwaysTryTypes: true,
            project: [path.resolve(appContext, "tsconfig.json")],
          },
        },
        react: {
          version: "detect",
        },
      },
      rules: {
        // Recommended rules
        ...require("@typescript-eslint/eslint-plugin").configs.recommended
          .rules,
        ...require("@typescript-eslint/eslint-plugin").configs.stylistic.rules,

        // React
        "react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
        "react/function-component-definition": [
          1,
          {
            namedComponents: "arrow-function",
            unnamedComponents: "arrow-function",
          },
        ],
        "react/require-default-props": "off",
        "react/react-in-jsx-scope": "off",

        // Hooks
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",

        // Import rules
        "import/extensions": [
          0,
          { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        ],
        "import/no-extraneous-dependencies": "off",

        // TypeScript-specific
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
            varsIgnorePattern:
              "^_|^(SET_|RESET_|APPEND_|UPDATE_|REMOVE_|DELETE_|TOGGLE_|FETCH_|LOAD_|PATCH_|ADD_)",
            caughtErrors: "none",
          },
        ],

        // Misc
        "no-plusplus": "off",
        "no-restricted-imports": "off",
        "no-shadow": "off",
        "no-undef": "off",
        "no-unused-vars": ["off"],
        "consistent-return": ["error"],
        "arrow-body-style": ["error", "as-needed"],
        "no-console": ["warn", { allow: ["warn", "error"] }],
      },
    },
    {
      files: [
        "**/eslint.config.js",
        "**/jest.config.js",
        "**/rspack.config.js",
        "**/serve.js",
        "**/.prettierrc.js",
      ],
      languageOptions: {
        parserOptions: {
          project: null,
        },
      },
    },
    ...overrides,
  ];
}

module.exports = createAppConfig;
