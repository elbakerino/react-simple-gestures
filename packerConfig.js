const path = require('path');
const {buildExternal, packer, webpack} = require('lerna-packer');

const apps = {
    demo: {
        root: path.resolve(__dirname, 'packages', 'demo'),
        template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
        publicPath: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
        port: 3000,
        main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'demo'),
        servedPath: '/',// todo: make package.json homepage dependent,
        vendors: [],
        plugins: [],
    },
};

const packages = {
    // the keys are the commonjs names that is applied to externals
    // this is the same as `@babel/plugin-transform-modules-commonjs` applies
    reactSimpleGestures: {
        name: 'react-simple-gestures',
        root: path.resolve(__dirname, 'packages', 'simple-gestures'),
        entry: path.resolve(__dirname, 'packages', 'simple-gestures/src/'),
        externals: {
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
        },
    },
};

packer(apps, packages, __dirname);
