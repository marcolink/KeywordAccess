const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChromeReloaderPlugin = require("webpack-chrome-extension-reloader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const path = require("path");

var options = {
    devtool: "source-map",
    entry: {
        popup: path.join(__dirname, "src", "js", "popup.js"),
        options: path.join(__dirname, "src", "js", "options.js"),
        background: path.join(__dirname, "src", "js", "background.js"),
        content: path.join(__dirname, "src", "js", "content.js")
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    plugins: [

        process.env.NODE_ENV === "development" ? new WebpackChromeReloaderPlugin({
            port: 9090,
            reloadPage: true,
            entries: {
                contentScript: 'content',
                background: 'background'
            }
        }) : null,

        new CopyWebpackPlugin([{
            from: "src/manifest.json",
            transform: function (content, path) {
                return Buffer.from(JSON.stringify({
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version,
                    ...JSON.parse(content.toString())
                }))
            }
        }]),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "background.html"),
            filename: "background.html",
            chunks: ["background"]
        }),

        new WriteFilePlugin()

    ].filter(plugin => !!plugin),
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["react-hmre", "stage-2"]
                }
            }
        }]
    }
};

module.exports = options;

