module.exports = function() {

    var client = './src/client/';
    var clientApp = client + 'app/';
    var server = './src/server';
    var temp = './temp/';

    var config = {
        temp: temp,

        /* all js to vet */
        alljs: [
            './src/**/*.js',
            './.js'
        ],
         css: temp + 'style.css',
        client: client,
        index: client + 'index.html',
        less: client + 'styles/styles.less',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',

        ],
        server: server,

        bower: {
            bowerJson: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },
        defaultPort: 7203,
        nodeServer: './src/server/app.js',
        browserReloadDelay: 1000

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
