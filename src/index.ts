import * as https from 'https';
import { readFile } from 'fs';
import * as semver from 'semver';

export default function checkUpdate(options: string | { name: string; version: string; }) {
    return new Promise<string | void>(async (resolve, reject) => {

        let currentVersion: string,
            latestVersion: string;

        try {

            if (typeof options === 'object') {
                currentVersion = options.version;
                latestVersion = await getVersion(options.name);
            } else currentVersion = await new Promise<string>(resolve =>
                readFile(options, 'utf8', async (err, data) => {
                    if (err) return reject(err);
                    const pkg = JSON.parse(data);
                    latestVersion = await getVersion(pkg.name);
                    resolve(pkg.version);
                })
            );

            if (semver.gt(latestVersion, currentVersion)) return resolve(latestVersion);
            resolve(null);

        } catch (err) {
            reject(err);
        }

    });
}

function getVersion(pkgName: string) {
    return new Promise<string>((resolve, reject) => {

        https.request({
            hostname: 'registry.npmjs.org',
            port: 443,
            path: '/' + pkgName,
            method: 'GET'
        }).on('response', (res) => {

            if (res.statusCode !== 200) return reject(new Error(`Status code: ${res.statusCode}`))

            let data = '';

            res.setEncoding('utf8')
                .on('data', c => data += c)
                .on('end', () => {
                    try {
                        const json = JSON.parse(data),
                            versions = Object.keys(json.time);
                        resolve(json['dist-tags'].latest || versions[versions.length - 1]);
                    } catch (err) {
                        reject(err);
                    }
                });

        }).on('error', reject).end();

    });
}
