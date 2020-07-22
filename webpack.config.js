const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = true; // TODO: get from cli flag

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    hungerGamesConfig: './src/client/config/hungergames'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: isDevelopment ? '[name].js' : '[name].[hash].js',
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
  plugins: [
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
  ]
};
