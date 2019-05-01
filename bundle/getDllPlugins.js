const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const getDllPlugins = () => {
  const plugins = [];

  const files = fs.readdirSync(path.resolve(__dirname, '../dll'));

  files.forEach((filename) => {
    if (/.*\.dll.js/.test(filename)) {
      plugins.push(
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, '../dll', filename),
        }),
      );
    } else if (/.*\.manifest.json/.test(filename)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', filename),
        }),
      );
    }
  });

  return plugins;
};

module.exports = getDllPlugins;
