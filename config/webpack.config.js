const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const tsconfig = require('../tsconfig.json');

const fs = require('fs');
const args = require('minimist')(process.argv);

let aliases = {};
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
  let filePath = `${fileBasePath}.${env}.ts`;
  console.log(path.resolve(filePath))
  return path.resolve(filePath);
}

module.exports = function () {
  return useDefaultConfig;
};


