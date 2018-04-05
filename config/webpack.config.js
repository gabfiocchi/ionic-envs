const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const tsconfig = require('../tsconfig.json');

const chalk = require('chalk');
const log = console.log;

const fs = require('fs');
const args = require('minimist')(process.argv);

let aliases = {};

log(`${chalk.yellow('Running on enviroment:')} ${chalk.green(args.env || 'dev')}`);

let pathKeyArray = Object.keys(tsconfig.compilerOptions.paths);
pathKeyArray.forEach(currentPath => {
  let correctPath = currentPath.replace("/*", "");
  let currentPathValue = tsconfig.compilerOptions.paths[currentPath][0].replace('*', '');
  aliases[correctPath] = path.resolve(tsconfig.compilerOptions.baseUrl + '/' + currentPathValue);
});

useDefaultConfig.dev.resolve = useDefaultConfig.prod.resolve = {
  extensions: ['.ts', '.js', '.json'],
  modules: [
    path.resolve('node_modules'),
    path.resolve(tsconfig.compilerOptions.baseUrl)
  ],
  alias: aliases
};
useDefaultConfig.prod.resolve.alias['@env'] = path.resolve(environmentPath('prod'));

useDefaultConfig.dev.resolve.alias['@env'] = path.resolve(environmentPath(args.env));

function environmentPath(env) {
  let fileBasePath = './src/environments/environment';
  let filePath = `${fileBasePath}.${env || 'dev'}.ts`;

  if (!fs.existsSync(filePath)) {
    log(chalk.red(`There was an error the file does not exist: ${filePath}`));
    process.exit();
  } else {
    return path.resolve(filePath);
  }
}

module.exports = function () {
  return useDefaultConfig;
};
