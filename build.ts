// const packager = require('electron-packager');
// const installer = require('electron-installer-windows');
// const colors = require('colors');
// const path = require('path');

import packager from 'electron-packager';
import installer from 'electron-installer-windows';
import 'colors';
import * as path from 'path';
import webpack from 'webpack';
import webpackOptions from './webpack.config';


(async () => {
    let path = await createPackage();
    console.log('\n');
    await createInstaller(path);
})();

async function compileFrontend() {
    webpack(webpackOptions, (err) => {
        if (err) {
            console.log('Error while compiling'.red);
            console.log(err);
        } else {
            console.log('Done compiling!'.green);
        }
    });
}

async function createPackage() {
    const ignoreFiles = [
        '\.map',
        '\.vscode',
        '\.gitignore',
        '\.idea',
        'README\.md',
        'build-windows.js',
        'package-lock.json',
        'tslint.json',
        'tsconfig.json',
        'build'
    ];

    let ignore = new RegExp(`(${ignoreFiles.join('|')})`);

    let options = {
        dir: __dirname,
        arch: 'x64',
        executableName: 'app',
        name: 'Nova Remote',
        out: path.join(__dirname, 'build'),
        overwrite: true,
        platform: 'win32',
        quiet: true,
        ignore: ignore,
    }

    console.log('Creating Packages'.green);
    const paths = await packager(options);
    console.log('Packages Created'.blue);
    console.log(`At: ${paths[0].white}`.grey);

    return paths[0];
}

async function createInstaller(src) {
    const options = {
        src,
        dest: path.join(__dirname, 'build/installer'),
        noMsi: true,
        exe: 'app.exe'
    }

    try {
        console.log('Creating Installer'.green);
        await installer(options);
        console.log('Installer Made'.blue);
    } catch (e) {
        console.log(e);
    }
}
