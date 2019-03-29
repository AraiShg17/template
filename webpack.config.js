const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



//const targetTypes = { ejs : 'html', js : 'js' };
//
//const getEntriesList = (targetTypes) => {
//  const entriesList = {};
//  for(const [ srcType, targetType ] of Object.entries(targetTypes)) {
//    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd : `${__dirname}/src` });
//
//    for(const srcName of filesMatched) {
//      const targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
//      entriesList[targetName] = `${__dirname}/src/${srcName}`;
//    }
//  }
//  return entriesList;
//}
//
//
//for(const [ targetName, srcName ] of Object.entries(getEntriesList({ ejs : 'html' }))) {
//  app.plugins.push(new HtmlWebpackPlugin({
//    filename : targetName,
//    template : srcName
//  }));
//}





const app = [
  {
    //CSS
    context: `${__dirname}`,
    entry: {
      '/css/style': './src/_scss/style.scss'
    },
    output: {
      path: `${__dirname}/public`,
      filename: '[name].css'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // CSSをバンドルするための機能
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: true,
                importLoaders: 2
              }
            },
            // PostCSSのための設定
            {
              loader: "postcss-loader",
              options: {
                ident: 'postcss',
                plugins: [
                  require("autoprefixer")({
                    browsers: [ 'last 2 versions' ],
                    grid: true
                  })
                ]
              }
            },
            // Sassをバンドルするための機能
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    devtool: 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/style.css',
      })
    ]
  },
  {
    //JS
    context: `${__dirname}`,
    entry: {
      '/js/common/common': './src/js/common/common.js'
    },
    output: {
      path: `${__dirname}/public`,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        },
      ]
    },
    devtool: 'source-map',
    plugins: [
    ]
  },
  {
    //EJS
    context: `${__dirname}`,
    entry: {
      'index': './src/index.ejs'
    },
    output: {
      path: `${__dirname}/public`,
      filename: '[name].html'
    },
    module: {
      rules: [
        {
          test : /\.ejs$/,
          use  : [
            'html-loader',
            'ejs-html-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.ejs'
      }),
      new CopyWebpackPlugin(
        //コンパイルしないものをコピー移動
        [
          {
            from: './',
            to: '',
            ignore: [
              '_**',
              '_**/**',
              '.**',
              '.**/**',
              '*.ejs',
              '*.js',
              '*.scss',
            ]
          },
        ],
        { context: 'src' }
      ),
      new CopyWebpackPlugin(
        //jsはプラグインのみコンパイルせずに移動
        [
          {
            from: './',
            to: 'js/libs',
          },
        ],
        { context: 'src/js/libs' }
      )
    ]
  }
];

module.exports = app;
