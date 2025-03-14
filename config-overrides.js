const { override, babelInclude, addWebpackPlugin } = require('customize-cra');
const ReactSVGPlugin = require('svg-react-loader'); // or  @svgr/webpack

module.exports = override(
  babelInclude([__dirname + '/src']),
  addWebpackPlugin(new ReactSVGPlugin({
    include: /\.svg$/ // or /\.react.svg$/
  }))
);