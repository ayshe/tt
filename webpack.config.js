var path = require("path");

var DIST_DIR   = path.join(__dirname, "public"),
    CLIENT_DIR = path.join(__dirname, "src");

module.exports = [{
    context: CLIENT_DIR,

    entry: "./main",

    output: {
        path:     DIST_DIR,
        filename: "main.js"
    },

    resolve: {
        extensions: ['*', '.js']
    }
},{
    context: CLIENT_DIR,

    entry: "./results",

    output: {
        path:     DIST_DIR,
        filename: "results.js"
    },

    resolve: {
        extensions: ['*', '.js']
    }
}];