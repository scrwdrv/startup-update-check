"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const fs_1 = require("fs");
const semver = require("semver");
function checkUpdate(options) {
    return new Promise(async (resolve, reject) => {
        let currentVersion, latestVersion;
        try {
            if (typeof options === 'object') {
                currentVersion = options.version;
                latestVersion = await getVersion(options.name);
            }
            else
                currentVersion = await new Promise(resolve => fs_1.readFile(options, 'utf8', async (err, data) => {
                    if (err)
                        return reject(err);
                    const pkg = JSON.parse(data);
                    latestVersion = await getVersion(pkg.name);
                    resolve(pkg.version);
                }));
            if (semver.gt(latestVersion, currentVersion))
                return resolve(latestVersion);
            resolve(null);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.default = checkUpdate;
function getVersion(pkgName) {
    return new Promise((resolve, reject) => {
        https.request({
            hostname: 'registry.npmjs.org',
            port: 443,
            path: '/' + pkgName,
            method: 'GET'
        }).on('response', (res) => {
            if (res.statusCode !== 200)
                return reject(new Error(`Status code: ${res.statusCode}`));
            let data = '';
            res.setEncoding('utf8')
                .on('data', c => data += c)
                .on('end', () => {
                try {
                    const json = JSON.parse(data), versions = Object.keys(json.time);
                    resolve(json['dist-tags'].latest || versions[versions.length - 1]);
                }
                catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject).end();
    });
}
//# sourceMappingURL=index.js.map