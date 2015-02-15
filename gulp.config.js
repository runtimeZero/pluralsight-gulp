module.exports = function() {

    var client = './src/client/';
    var clientApp = client + 'app/';
    var server = './src/server';
    var temp = './temp/';

    var config = {

        /* all js to vet */
        alljs: [
            './src/**/*.js',
            './.js'
        ],
        bower: {
            bowerJson: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },
        browserReloadDelay: 1000,
        build: './build/',
        client: client,
        css: temp + 'style.css',
        defaultPort: 7203,
        fonts: './bower_components/font-awesome/fonts/**/**',
        images: '/images/**/*.*',
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',

        ],
        less: client + 'styles/styles.less',
        nodeServer: './src/server/app.js',
        server: server,
        temp: temp
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;

    };

    return config;
}
