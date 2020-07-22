const webpack = require('webpack-cli');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = env => {
  const plugins = [
    new HtmlWebpackPlugin({
      title: 'Discotheque Config Panel',
      minify: true,
      templateContent: ({ htmlWebpackPlugin }) => {
        htmlWebpackPlugin.tags.bodyTags = htmlWebpackPlugin.tags.bodyTags.map(
          tag => {
            if (tag.tagName === 'script' && tag.attributes.src) {
              tag.attributes.src = '/' + tag.attributes.src;
            }
            return tag;
          }
        );

        return `
        <html lang="en">
          <head>
            <title>Hunger Games Configuration</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${htmlWebpackPlugin.tags.headTags}
          </head>
          <body>
            <div id="react-root"></div>
          </body>
        </html>
      `;
      }
    })
  ];

  if (env.analyze) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8765 }));
  }

  return {
    mode: !env.production ? 'development' : 'production',
    entry: {
      hungerGamesConfig: './src/client/config/hungergames'
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: !env.production ? '[name].js' : '[name].[hash].js',
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { configFile: 'tsconfig.client.json' }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                modules: true
              }
            },
            // Compiles Sass to CSS
            'sass-loader'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
    },
    plugins
  };
};
