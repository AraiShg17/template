const path = require('path');
const globule = require('globule');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const targetTypes = null;

const getEntriesList = (targetTypes) => {
  const entriesList = {};
  for(const [ srcType, targetType ] of Object.entries(targetTypes)) {
    let filesMatched = null

    if (srcType === 'ejs') {
      filesMatched = globule.find([`**/*.${srcType}`, `!_ejs/**`], { cwd : `${__dirname}/src` });
    } else if (srcType === 'scss') {
      filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], {cwd: `${__dirname}/src`});
    }  else if (srcType === 'js') {
      filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`, `!**/libs/**`], {cwd: `${__dirname}/src`});
    } else {
      return;
    }

    for(const srcName of filesMatched) {
      let targetName = null;
      if (srcType === 'js') {
        targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), ``);
      } else if (srcType === 'scss') {
        targetName = srcName.replace(/_scss/,'css').replace(new RegExp(`.${srcType}$`, 'i'), ``);
      } else {
        targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
      }
      entriesList[targetName] = `${__dirname}/src/${srcName}`;
    }
  }
  return entriesList;
}

//console.log(getEntriesList({ ejs : 'html' }));
//console.log(getEntriesList({ scss : 'css' }));
//console.log(getEntriesList({ js : 'js' }));



const app = (env, argv) => {
  let sourceMap = 'source-map'
  if(argv.mode === 'production') {
    sourceMap = ''
  }

  const settings = [
    {
      //CSS
      context: `${__dirname}`,
      entry: getEntriesList({ scss : 'css' }),
      output: {
        path: `${__dirname}/public/`,
        filename: './../cssCompile/[name].js'
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
      devtool: sourceMap,
      plugins: [
        new MiniCssExtractPlugin({
          filename: './[name].css'
        })
      ]
    },
    {
      //JS
      context: `${__dirname}`,
      entry: getEntriesList({ js : 'js' }),
      output: {
        path: `${__dirname}/public/`,
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
      devtool: sourceMap,
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

  //ejsファイルセット
  for(const [ targetName, srcName ] of Object.entries(getEntriesList({ ejs : 'html' }))) {
    settings[2].plugins.push(new HtmlWebpackPlugin({
      filename : targetName,
      template : srcName
    }));
  }

  return settings;
}



module.exports = app;
