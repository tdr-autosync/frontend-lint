# Shared linters configurations

This repo contains configurations for tools which are used to lint front-end files.

## Installation

First install the package and remove manually installed packages if any.

<!-- installationCommand -->

```bash
yarn add @motoinsight/lint && yarn remove babel-eslint eslint eslint-config-prettier eslint-plugin-jest eslint-plugin-nuxt eslint-plugin-prettier eslint-plugin-simple-import-sort eslint-plugin-vue prettier stylelint stylelint-config-rational-order stylelint-config-recommended stylelint-scss
```

<!-- /installationCommand -->

Add the following text to `package.json` root object:

```json
  "prettier": "@motoinsight/lint/prettier-config-default",
  "eslintConfig": {
    "extends": [
      "@motoinsight/lint/eslint-config-default"
    ]
  },
  "stylelint": {
    "extends": [
      "@motoinsight/lint/stylelint-config-default",
    ]
  }
```

Add the following text to `package.json` scripts section:

```json
    "lint": "yarn motoinsight-lint"
```

To add a support for "pre-commit" please add the following text to `.pre-commit-config.yaml`:

<!-- pre-commit -->

```yml
- repo: /home/serhii/ulint
  rev: v1.0.0
  hooks:
    - id: motoinsight_frontend_lint
```

<!-- /pre-commit -->

## Overriding rules
