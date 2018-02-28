# Ionic Environment Variables 🚀

With this configuration, you can import environment variables anywhere, even in your `app.module.ts`.
Also supports any number of custom environments (prod, staging, dev, etc.)
This project uses the [@ionic/app-script](https://github.com/ionic-team/ionic-app-scripts) package. I recommend updating/installing this package before starting.

Install `minimist` package.
```bash
$ npm i -D minimist
```

Add the following to your `package.json`:
```json
"config": {
  "ionic_webpack": "./config/webpack.config.js"
}
```

Add the following to your `tsconfig.json` in `compilerOptions`:
```json
"baseUrl": "./src",
"paths": {
  "@env": [
    "environments/environment"
  ]
}
```

Create a file in your base directory `config/webpack.config.js` and paste the following:
```javascript
const fs = require('fs');
const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const tsconfig = require('../tsconfig.json');

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
useDefaultConfig.prod.resolve.alias = {
  "@env": path.resolve(environmentPath('prod'))
};

useDefaultConfig.dev.resolve.alias = {
  "@env": path.resolve(environmentPath(args.env))
};

function environmentPath(env) {
  let fileBasePath = './src/environments/environment';
  let filePath = `${fileBasePath}.${env}.ts`;

  if (!fs.existsSync(filePath)) {
    return path.resolve(`${fileBasePath}.ts`);
  } else {
    return path.resolve(filePath);
  }
}

module.exports = function () {
  return useDefaultConfig;
};
```

Create a production file `src/environments/environment.prod.ts` which will be used for your **PRODUCTION** environment:
```typescript
export const config = {
  mode: 'Production'
}
```

Create a developer file `src/environments/environment.dev.ts` which will be used for your development environment:
```typescript
export const config = {
  mode: 'Development'
}
```
Create a default file `src/environments/environment.ts` which will be used for your environment:
```typescript
export const config = {
  mode: 'Default'
}
```

You can then import your environment variables anywhere!
```typescript
import { config } from '@env';
```

To test production builds: `ionic build --prod --env=staging` then open the www/index.html file in your browser.
## If more than `prod` and `dev` environments are wanted

1. Add to your `package.json` another run script and name it whatever you would like
```json
"serve:testing": "ionic-app-scripts serve --env=testing"
```
2. Create your testing file `src/environments/environment.testing.ts`.
3. Finally, run the script by using the name you used for your script in `package.json`
```bash
$ npm run serve:testing
```
