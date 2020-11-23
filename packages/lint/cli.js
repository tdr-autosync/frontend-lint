#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const { ESLint } = require('eslint');
const prettier = require('prettier');
const stylelint = require('stylelint');

const globalConfig = {
  errorsOnly: false,
  fix: false,
  verbose: false,
  paths: [],
};

function logLine(msg = '') {
  process.stdout.write(`${msg}\n`);
}

function logNormal(msg = '') {
  if (!globalConfig.errorsOnly) {
    logLine(msg);
  }
}

function logVerbose(msg = '') {
  if (!globalConfig.errorsOnly && globalConfig.verbose) {
    logLine(chalk.gray(msg));
  }
}

function logSuccess(msg) {
  if (!globalConfig.errorsOnly) {
    logLine(chalk.greenBright(msg));
  }
}

function logWarning(msg) {
  if (!globalConfig.errorsOnly) {
    logLine(chalk.yellowBright(msg));
  }
}

function logError(msg) {
  logLine(chalk.redBright(msg));
}

function logCriticalError(msg) {
  logLine(chalk.red(msg));
}

function getConfig() {
  for (const arg of process.argv.slice(2)) {
    switch (arg) {
      case '--errors-only':
        globalConfig.errorsOnly = true;
        break;
      case '--fix':
        globalConfig.fix = true;
        break;
      case '--verbose':
        globalConfig.verbose = true;
        break;
      default:
        if (arg[0] === '-') {
          logCriticalError(`Unknown argument: ${arg}`);
          process.exit(1);
        }
        globalConfig.paths.push(arg);
    }
  }
  return globalConfig;
}

function filterPaths(paths, supporterExtensions) {
  return paths.filter(item => {
    const ext = path.extname(item);
    return supporterExtensions.includes(ext);
  });
}

async function runESLint(config) {
  // Create an instance with the default config.
  const eslintDefault = new ESLint({
    overrideConfigFile: require.resolve(
      '@motoinsight/eslint-plugin-default/eslint-config-recommended',
    ),
    extensions: ['.js', '.vue'],
    fix: config.fix,
  });

  // Create an instance with a user provided config.
  const eslint = new ESLint({
    extensions: ['.js', '.vue'],
    fix: config.fix,
  });

  const results = [];

  // Lint files.
  for (const filePath of config.files) {
    logVerbose(`- ${filePath}`);
    if (await eslint.isPathIgnored(filePath)) {
      continue;
    }
    const fileConfig = await eslint.calculateConfigForFile(filePath);
    const hasUserConfig = Object.keys(fileConfig.rules).length > 0;
    const fileResults = hasUserConfig
      ? await eslint.lintFiles(filePath)
      : await eslintDefault.lintFiles(filePath);
    results.push(...fileResults);
  }

  // Modify the files with the fixed code.
  if (config.fix) {
    await ESLint.outputFixes(results);
  }

  // Format the results.
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  // Output it.
  if (resultText) {
    logLine(resultText);
  }

  return results.every(result => result.errorCount === 0 && result.warningCount === 0);
}

const styleLintBaseConfig = require('./stylelint-config-default');

async function runStylelint(config) {
  const linter = stylelint.createLinter();
  const results = [];

  // Lint files.
  for (const filePath of config.files) {
    logVerbose(`- ${filePath}`);
    if (await linter.isPathIgnored(filePath)) {
      continue;
    }
    let options;
    try {
      await linter.getConfigForFile(filePath);
      options = {
        files: filePath,
        fix: config.fix,
      };
    } catch (e) {
      if (e.message.includes('No configuration provided')) {
        options = {
          config: styleLintBaseConfig,
          files: filePath,
          fix: config.fix,
        };
      } else {
        throw e;
      }
    }
    const fileResults = await stylelint.lint(options);
    results.push(...fileResults.results);
  }

  // Output results.
  if (results.length) {
    const output = stylelint.formatters.string(results);
    if (output) {
      logLine(output);
    }
  }

  return results.every(result => !result.errored);
}

const prettierBaseConfig = require('./prettier-config-default');

function runPrettier(config) {
  let result = true;
  const filesToFormat = [];

  // Check files.
  for (const filePath of config.files) {
    logVerbose(`- ${filePath}`);

    // Try to detect a format of a file.
    const { inferredParser, ignored } = prettier.getFileInfo.sync(filePath, {
      ignorePath: '.prettierignore',
    });
    if (!inferredParser || ignored) {
      continue;
    }

    // Prepare a config
    const prettierConfig = {
      ...(prettier.resolveConfig.sync(filePath) || prettierBaseConfig),
      parser: inferredParser,
    };

    try {
      const source = fs.readFileSync(filePath, 'utf-8');
      if (config.fix) {
        const formatted = prettier.format(source, prettierConfig);
        if (source !== formatted) {
          fs.writeFileSync(filePath, formatted, { encoding: 'utf-8' });
        }
      } else {
        const formatted = prettier.check(source, prettierConfig);
        if (!formatted) {
          result = false;
          filesToFormat.push(filePath);
        }
      }
    } catch (e) {
      logCriticalError(`Error during processing ${filePath}`);
      logCriticalError(e.message);
      throw e;
    }
  }

  // Output results.
  if (filesToFormat.length) {
    logError('Files require formatting:');
    filesToFormat.forEach(item => logError(`- ${item}`));
  }

  return result;
}

async function runLinter({ name, fn, config, allFiles, extensions }) {
  logNormal(`Running ${name}...`);
  const files = extensions ? filterPaths(allFiles, extensions) : allFiles;
  if (!files.length) {
    logWarning('No files to check\n');
    return true;
  }
  const result = await fn({ ...config, files });
  if (result) {
    logSuccess('No errors found\n');
    return true;
  }
  return false;
}

async function main() {
  const config = getConfig();
  if (!config.paths.length) {
    config.paths.push('**');
  }

  const allFiles = globby.sync(config.paths, {
    gitignore: true,
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });

  const eslintSuccess = await runLinter({
    name: 'ESLint',
    fn: runESLint,
    config,
    allFiles,
    extensions: ['.js', '.vue'],
  });

  const stylelintSuccess = await runLinter({
    name: 'StyleLint',
    fn: runStylelint,
    config,
    allFiles,
    extensions: ['.vue', '.css', '.scss'],
  });

  const prettierSuccess = await runLinter({
    name: 'Prettier',
    fn: runPrettier,
    config,
    allFiles,
  });

  if (!eslintSuccess || !stylelintSuccess || !prettierSuccess) {
    if (!globalConfig.errorsOnly) {
      logCriticalError('\nErrors found. Please fix them.');
    }
    process.exit(1);
  } else {
    process.exit(0);
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
})();
