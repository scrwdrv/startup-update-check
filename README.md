# startup-update-check
Check your custom CLI tool version with npm at startup and notify users if a newer version is published.


## Installation
```sh
npm i startup-update-check
```

## Usage
### Provide path of `package.json`
```js
import checkUpdate from 'startup-update-check';

checkUpdate('./package.json').then((newerVersion) => {
    if (newerVersion) {
        //do your things
    } else {
        //up to date
    }
}).catch((err) => {
    console.log(err);
});
```
### Specify package name and version directly
```js
checkUpdate({
    name: 'safe-backup',
    version: '1.2.5'
}).then((newerVersion) => {
    if (newerVersion) {
        //do your things
    } else {
        //up to date
    }
}).catch((err) => {
    console.log(err);
});
```