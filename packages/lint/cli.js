#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');
const prettier = require('prettier');
const stylelint = require('stylelint');
const globby = require('globby');

const prettierBaseConfig = require('./prettier-config-default');

function getConfig() {
  const config = {
    fix: false,
    verbose: false,
    paths: [],
  };
  for (const arg of process.argv.slice(2)) {
    switch (arg) {
      case '--fix':
        config.fix = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      default:
        if (arg[0] === '-') {
          console.error(`Unknown argument: ${arg}`);
          process.exit(1);
        }
        config.paths.push(arg);
    }
  }
  return config;
}

function filterPaths(paths, supporterExtensions) {
  return paths.filter(item => {
    const ext = path.extname(item);
    return supporterExtensions.includes(ext);
  });
}

function showFilesToCheck(files) {
  console.log('Files to check:');
  files.forEach(item => console.log(`- ${item}`));
}

async function runESLint(config) {
  // Create an instance.
  const eslint = new ESLint({
    baseConfig: {
      extends: ['plugin:@motoinsight/eslint-plugin-default/recommended'],
    },
    extensions: ['.js', '.vue'],
    fix: config.fix,
  });

  // Lint files.
  const results = await eslint.lintFiles(config.files);

  // Modify the files with the fixed code.
  if (config.fix) {
    await ESLint.outputFixes(results);
  }

  // Format the results.
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  // Output it.
  if (resultText) {
    console.log(resultText);
  }

  return {
    errorsCount: results
      .map(result => result.errorCount + result.warningCount)
      .reduce((a, b) => a + b),
  };
}

async function runStylelint(config) {
  // Lint files.
  const results = await stylelint.lint({
    files: config.files,
    fix: config.fix,
    formatter: 'string',
  });

  // Output results.
  if (results.output) {
    console.log(results.output);
  }

  return {
    errorsCount:
      Number(results.errored) +
      results.results.map(result => result.warnings.length).reduce((a, b) => a + b),
  };
}

function runPrettier(config) {
  const result = {
    errorsCount: 0,
  };
  const filesToFormat = [];
  for (const filePath of config.files) {
    const { inferredParser } = prettier.getFileInfo.sync(filePath);
    if (!inferredParser) {
      continue;
    }
    const prettierConfig = {
      ...prettierBaseConfig,
      ...(prettier.resolveConfig.sync(filePath) || {}),
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
          result.errorsCount++;
          filesToFormat.push(filePath);
        }
      }
    } catch (e) {
      console.log(`Error during processing ${filePath}`);
      console.log(e.message);
    }
  }
  if (filesToFormat.length) {
    console.log('Files require formatting:');
    filesToFormat.forEach(item => console.log(`- ${item}`));
  }
  return result;
}

(async () => {
  try {
    const config = getConfig();
    if (!config.paths.length) {
      config.paths.push('**');
    }
    const allFiles = globby.sync(config.paths, {
      gitignore: true,
      ignore: ['./node_modules/**', '**/node_modules/**'],
    });

    let hasErrors = false;

    console.log('\nRunning ESLint...');
    try {
      const files = filterPaths(allFiles, ['.js', '.vue']);
      if (files.length) {
        if (config.verbose) {
          showFilesToCheck(files);
        }
        const eslintResult = await runESLint({ fix: config.fix, files });
        if (eslintResult.errorsCount) {
          hasErrors = true;
        } else {
          console.log('No errors found');
        }
      } else {
        console.log('No files to check');
      }
    } catch (e) {
      console.error(e);
    }

    console.log('\nRunning StyleLint...');
    try {
      const files = filterPaths(allFiles, ['.vue', '.css', '.scss']);
      if (files.length) {
        if (config.verbose) {
          showFilesToCheck(files);
        }
        const stylelintResult = await runStylelint({ fix: config.fix, files });
        if (stylelintResult.errorsCount) {
          hasErrors = true;
        } else {
          console.log('No errors found');
        }
      } else {
        console.log('No files to check');
      }
    } catch (e) {
      console.error(e);
    }

    console.log('\nRunning Prettier...');
    try {
      const files = filterPaths(allFiles, [
        '.css',
        '.less',
        '.scss',
        '.graphql',
        '.gql',
        '.html',
        // *.js files are handled by ESLint
        // '.js',
        '.jsx',
        '.json',
        '.md',
        '.markdown',
        '.mdown',
        '.mkdn',
        '.mdx',
        '.ts',
        '.tsx',
        // *.vue files are handled by ESLint
        // '.vue',
        '.yaml',
        '.yml',
      ]);
      if (files.length) {
        if (config.verbose) {
          showFilesToCheck(files);
        }
        const prettierResult = await runPrettier({ fix: config.fix, files });
        if (prettierResult.errorsCount) {
          hasErrors = true;
        } else {
          console.log('No errors found');
        }
      } else {
        console.log('No files to check');
      }
    } catch (e) {
      console.error(e);
    }
    if (hasErrors) {
      console.log('\nErrors found. Please fix them.');
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
