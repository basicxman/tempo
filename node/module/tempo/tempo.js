var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var tempo = require('./lib/tempo').tempo

var _window;

tempo.exports.templates.prototype.load = function (file, callback) {
    return callback(fs.readFileSync(file, 'UTF-8'));
}

tempo.load = function (template, callback) {
    fs.readFile(template, 'UTF-8', function(err, data) {
        if (err) throw err;
        document = jsdom(data);
        _window = document.createWindow();

        callback(tempo.init(_window));
    });
}

tempo.write = function (res) {
    res.write(_window.document.innerHTML);
}

tempo.compile = function(markup, options) {
    options = options || {};
    var name = options.filename || markup;
    var data = markup;
    document = jsdom(data);
    window = document.createWindow();

    var renderer = tempo.init(window).prepare(document.getElementsByTagName('html')[0]);

    return function render(locals) {
        renderer.render(locals);
        return window.document.innerHTML;
    };
};

module.exports = tempo;