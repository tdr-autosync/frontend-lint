# Motoinsight Frontend Linter

Maintainer: Serhii Petkun

This repo contains configurations for tools which are used to lint front-end files. If you have any questions or suggestions please contact Serhii Petkun.

## Table of contents

- [Usage](#usage)
- [Installation](#installation)
- [Adding `yarn lint` command support](#adding-yarn-lint-command-support)
- [Adding pre-commit support](#adding-pre-commit-support)
- [Ignoring files](#ignoring-files)
- [Overriding rules](#overriding-rules)
- [Technical details](#technical-details)

## Usage

```bash
yarn motoinsight-lint [options] [file/dir/glob ...]
```

Following command line options are supported:

| Option          | Description               |
| --------------- | ------------------------- |
| `--errors-only` | Show error messages only. |
| `--fix`         | Fix all fixable errors.   |
| `--verbose`     | Show detailed output.     |

## Installation

If there are any eslint, stylelint or prettier related packages, remove them.

```bash
yarn remove <eslint-related> <stylelint-related> <prettier-related>
```

If there are any eslint, stylelint or prettier related configuration files, remove them too.

```bash
find . \( -name "*eslintrc*" -or -name "*stylelintrc*" -or -name "*prettierrc*" \) -not -path "*node_modules*"
```

Install the package.

```bash
yarn add -D @motoinsight/lint
```

<details>
  <summary>In case of an error</summary>
  
  ### Error: An unexpected error occurred: "https://registry.yarnpkg.com/@motoinsight%2flint: Not found".
  Make sure that file `.npmrc` which is located in the same folder as `package.json` contains the following line:
  ```
  @motoinsight:registry=https://npm.unhaggle.com/
  ```

  ### npm ERR! 404  '@motoinsight/lint@2.0.2' is not in the npm registry.
  To fix this error just add the following line to `~/.npmrc`:
  ```
  @motoinsight:registry=https://npm.unhaggle.com/
  ```
</details>

Add the following text to `package.json` root object:

```json
  "prettier": "@motoinsight/lint/prettier-config-default",
  "eslintConfig": {
    "root": true,
    "extends": [
      "plugin:@motoinsight/eslint-plugin-motoinsight/recommended"
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

To add a support for "pre-commit" please remove from `.pre-commit-config.yaml` existing eslint, stylelint or prettier related rules first.

Then add the following text to `.pre-commit-config.yaml`:

```yml
- repo: git@github.com:unhaggle/frontend-lint.git
  rev: v1.0.0 # Check the latest version in GitHub.
  hooks:
    - id: motoinsight_frontend_lint
```

## Ignoring files

To ignore specific files please use corresponding files: `.eslintignore`, `.stylelintignore`, `.prettierignore`. The format is the same as in `.gitignore` file.

## Overriding rules

Our goal is use a consistent code style, please override rules only when there is no way to use a default configuration.

### Overriding ESLint rules

1. Remove `eslintConfig` section from `package.json`.
2. Create `.eslintrc.js` file in project directory.
3. Add the following text to the created file:
   ```js
   module.exports = {
     root: true,
     extends: ['plugin:@motoinsight/eslint-plugin-motoinsight/recommended'],
     rules: {
       // Rules to override
     },
   };
   ```
4. Use `rules` section to override ESLint configuration.
   For example, to disable a particular rule you can use the following line:
   ```js
   'vue/attributes-order': 'off',
   ```

### Overriding StyleLint rules

1. Remove `stylelint` section from `package.json`.
2. Create `.stylelintrc.js` file in project directory.
3. Add the following text to the created file:
   ```js
   module.exports = {
     extends: ['@motoinsight/lint/stylelint-config-default'],
     rules: {
       // Rules to override
     },
   };
   ```
4. Use `rules` section to override ESLint configuration.
   For example, to disable a particular rule you can use the following line:
   ```js
   'property-no-unknown': null,
   ```

### Overriding Prettier rules

1. Remove `prettier` section from `package.json`.
2. Create `.prettierrc.js` file in project directory.
3. Add the following text to the created file:

   ```js
   const baseConfig = require('@motoinsight/lint/prettier-config-default');

   module.exports = {
     ...baseConfig,
     printWidth: 80,
   };
   ```

4. Use `rules` section to override ESLint configuration.
   For example, to disable a particular rule you can use the following line:
   ```js
   'property-no-unknown': null,
   ```

## Technical details

This tool uses ESLint, StyleLint and Prettier under the hood.

ESLint checks `.js` and `.vue` files.

StyleLint checks `.vue`, `.css` and `.scss` files.

Prettier checks all files.

### Publishing a new version

New versions are published as git tags. Version tag format is `v0.0.0`.
