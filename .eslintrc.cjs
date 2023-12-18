module.exports = {
    "env": {
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2022,
        "sourceType": "module",
        "ecmaFeatures": {
          "modules": true
        },
        "tsconfigRootDir": __dirname,
        "project": ["./tsconfig.json"]
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-unused-vars": "error",
        "no-unused-vars": ["error", { "vars": "local", "args": "none", "varsIgnorePattern": "^[A-Z]"}],
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/prefer-as-const": "off",
  }
}