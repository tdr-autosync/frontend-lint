# Shared linters configurations

This repo contains configurations for tools which are used to lint front-end files.

## Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Adding IDE support](#adding-ide-support)
- [Adding `yarn lint` command support](#adding-yarn-lint-command-support)
- [Adding pre-commit support](#adding-pre-commit-support)
- [Overriding rules](#overriding-rules)
- [Technical details](#technical-details)

## Usage

```bash
yarn motoinsight-lint [options] [file/dir/glob ...]
```

Following command line options are supported:

| Option      | Description             |
| ----------- | ----------------------- |
| `--fix`     | Fix all fixable errors. |
| `--verbose` | Show detailed output.   |

## Installation

First install the package.

```bash
yarn add -D @motoinsight/lint
```

If there are any eslint, stylelint or prettier related packages, remove them.

```bash
yarn remove <eslint-related> <stylelint-related> <prettier-related>
```

If there are any eslint, stylelint or prettier related configuration files, remove them too.

## Adding IDE support

To add IDE support for all used linters, add the following text to `package.json` root object:

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

## Adding `yarn lint` command support

To be able to run linters with `yarn lint`, add the following text to `package.json` scripts section:

```json
    "lint": "motoinsight-lint"
```

## Adding pre-commit support

To add a support for "pre-commit" please add the following text to `.pre-commit-config.yaml`:

```yml
- repo: https://github.com/unhaggle/frontend-lint
  rev: v1.0.0
  hooks:
    - id: motoinsight_frontend_lint
```

## Overriding rules

### Overriding ESLint rules

TODO

### Overriding StyleLint rules

TODO

### Overriding Prettier rules

TODO

## Technical details

This tool uses ESLint, StyleLint and Prettier under the hood.

ESLint checks `.js` and `.vue` files.

StyleLint checks `.vue`, `.css` and `.scss` files.

Prettier checks all files.
