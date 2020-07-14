#!/usr/bin/env node
/* eslint-disable no-console */

const childProcess = require('child_process');
const path = require('path');
const { ESLint } = require('eslint');
const stylelint = require('stylelint');
const globby = require('globby');

function getConfig() {
  const config = {
    fix: false,
    paths: [],
  };
  for (const arg of process.argv.slice(2)) {
    switch (arg) {
      case '--fix':
        config.fix = true;
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

async function runESLint(config) {
  // Create an instance.
  const eslint = new ESLint({
    baseConfig: require('./eslint-config-default'),
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
  console.log(resultText);

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
  console.log(results.output);

  return {
    errorsCount:
      Number(results.errored) +
      results.results.map(result => result.warnings.length).reduce((a, b) => a + b),
  };
}

function runPrettier(config) {
  return new Promise((resolve, reject) => {
    // keep track of whether callback has been invoked to prevent multiple invocations
    let invoked = false;
    const args = [config.fix ? '--write' : '-c', ...config.files];
    const process = childProcess.fork(require.resolve('prettier/bin-prettier'), args);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', err => {
      if (invoked) {
        return;
      }
      invoked = true;
      reject(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', code => {
      if (invoked) {
        return;
      }
      invoked = true;
      resolve({ errorsCount: code === 0 ? 0 : 1 });
    });
  });
}

(async () => {
  try {
    const config = getConfig();
    if (!config.paths.length) {
      config.paths.push('**');
    }
    const allFiles = globby.sync(config.paths, { gitignore: true, ignore: ['./node_modules/**', '**/node_modules/**'] });

    let hasErrors = false;

    console.log('\nRunning ESLint...');
    try {
      const files = filterPaths(allFiles, ['.js', '.vue']);
      if (files.length) {
        const eslintResult = await runESLint({ fix: config.fix, files });
        if (eslintResult.errorsCount) {
          hasErrors = true;
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
        const stylelintResult = await runStylelint({ fix: config.fix, files });
        if (stylelintResult.errorsCount) {
          hasErrors = true;
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
        '.js',
        '.jsx',
        '.json',
        '.md',
        '.markdown',
        '.mdown',
        '.mkdn',
        '.mdx',
        '.ts',
        '.tsx',
        '.vue',
        '.yaml',
        '.yml',
      ]);
      if (files.length) {
        const prettierResult = await runPrettier({ fix: config.fix, files });
        if (prettierResult.errorsCount) {
          hasErrors = true;
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
      console.log('\nNo errors found.');
      process.exit(0);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
