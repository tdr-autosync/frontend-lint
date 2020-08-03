# Shared linters configurations

This repo contains configurations for tools which are used to lint front-end files.

## Installation

First install the package and remove manually installed packages if any.

<!-- installationCommand -->

```bash
yarn add -D @motoinsight/lint && yarn remove babel-eslint eslint eslint-config-prettier eslint-plugin-jest eslint-plugin-nuxt eslint-plugin-prettier eslint-plugin-simple-import-sort eslint-plugin-vue prettier stylelint stylelint-config-rational-order stylelint-config-recommended stylelint-scss
```

<!-- /installationCommand -->

Add the following text to `package.json` root object:

```json
  "prettier": "@motoinsight/lint/prettier-config-default",
  "eslintConfig": {
    "root": true,
    "extends": [
      "plugin:@motoinsight/eslint-plugin-default/recommended"
    ]
  },
  "stylelint": {
    "extends": [
      "@motoinsight/lint/stylelint-config-default"
    ]
  }
```

Add the following text to `package.json` scripts section:

```json
    "lint": "yarn motoinsight-lint"
```

To add a support for "pre-commit" please add the following text to `.pre-commit-config.yaml`:

<!-- pre-commit -->

TODO: provide real repo

```yml
- repo: /home/serhii/ulint
  rev: v1.0.0
  hooks:
    - id: motoinsight_frontend_lint
```

<!-- /pre-commit -->

## Overriding rules

TODO

## Details

This tool uses ESLint, StyleLint and Prettier under the hood.

Following files are getting checked:

- .css
- .less
- .scss
- .graphql
- .gql
- .html
- .js
- .jsx
- .json
- .md
- .markdown
- .mdown
- .mkdn
- .mdx
- .ts
- .tsx
- .vue
- .yaml
- .yml
