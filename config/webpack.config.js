const webpack = require("webpack");
const fs = require("fs");
const del = require("del");
const path = require("path");
const config = require("config");
const glob = require("glob-all");

//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");
const { ifProduction, ifNotProduction } = getIfUtils(process.argv[3]);

// path variables
const root = path.resolve(__dirname, "../");
const src = path.resolve(root, "./src");
const flask_app = path.resolve(root, "flask_app");
const assets = path.resolve(flask_app, "assets");
const images = path.resolve(assets, "images");
const templates = path.resolve(flask_app, "templates");

// delete prior webpack assets in the public path's /assets/ before webpack starts processing
del.sync([path.resolve(assets, "*.(js|br|css|gif|gz|svg|json|LICENSE|txt)")]);

module.exports = (env, argv) => {
  console.log("ENVIRONMENT: " + process.env.ENV);
  console.log(config);

  const devMode = argv.mode !== "production";
  const environment = argv.mode;
  return {
    context: root,
    devtool: devMode ? "eval-source-map" : false, // allows creation of a source map in dev mode only
    entry: {
      //  webpack's starting point
      app: "./src/index.js",
    },
    output: {
      // where the output files are deposited post-processing
      path: assets,
      filename: devMode ? "[name].js" : "[name].[fullhash].js", // do not use fingerprinting in dev mode, it screws up dev server
      publicPath: "/assets/",
    },
    resolve: {
      // where webpack is going to look for imported modules when it starts processing the entry files
      modules: ["node_modules", "src"],
      extensions: ["*", ".js"],
    },
    devServer: {
      publicPath: "/assets/",
      watchContentBase: true,
      watchOptions: {
        ignored: [assets, `${templates}/**/*.inc`],
      },
      hot: true,
      //writeToDisk: true,
      proxy: {
        // forwards any request for a non-webpack asset thru to flask
        "!(/assets/*.(js|css))": {
          target: "http://localhost:" + process.env.FLASK_PORT || 5000,
          secure: false,
        },
      },
    },
    module: {
      // "loaders" process entry file and dependencies
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-transform-template-literals",
                "@babel/plugin-transform-runtime",
              ],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            // MiniCssExtractPlugin extracts all the css from the JS and puts it in a single bundled file
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },
            {
              // This loader resolves url() and @imports inside CSS
              loader: "css-loader",
              options: {
                sourceMap: ifNotProduction(),
              },
            },
            {
              // Run postcss actions
              loader: "postcss-loader",
              options: {
                // `postcssOptions` is needed for postcss 8.x;
                // if you use postcss 7.x skip the key
                postcssOptions: {
                  // postcss plugins, can be exported to postcss.config.js
                  plugins: function () {
                    return [require("autoprefixer")];
                  },
                },
              },
            },
            {
              // transform SASS to standard CSS
              loader: "sass-loader",
              options: {
                implementation: require("node-sass"), // can be 'sass' or 'node-sass'.  node-sass seems a touch faster
                sourceMap: ifNotProduction(),
              },
            },
          ],
        },
        // handles images
        {
          test: /\.(gif|jpg|png|jpeg|ico)$/, // notably, svg is missing.  I don't know why but when added it causes the svg to be empty
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        },
        {
          // handles any fonts in /src
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          exclude: ["/images/", "/assets/images/", `${assets}/images/`], // this is because svg can be both fonts and images.  Don't process svg images as fonts
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: removeEmpty([
      ifProduction(
        // analyzes the files matching the pattern, and REMOVES any css from the main css chunk that is
        // NOT used in the code.  Have to be careful with this because it can create issues where some styles
        // don't work in production.  i.e. if a style is added via javascript and it's not on the whitelist
        new PurgecssPlugin({
          paths: glob.sync([
            "./src/**/*.{js,jsx,j2,html,handlebars,hbs,inc,vue}",
            `${templates}/**/*.{j2,html,inc,vue}`,
          ]),
          safelist: {
            standard: [
              /^btn-/,
              /modal/,
              /alert/,
              /fade/,
              /valid/,
              /spinner/,
              /carousel/,
              /tooltip/,
              /^fa-/,
              /icon/,
              /^alert/,
              /fadeIn/,
              /fadeOut/,
              /^page-/,
            ],
            deep: [],
            greedy: [],
          },
        })
      ),
      // important.  extracts all css from the main JS bundle into a single file
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[fullhash].css",
      }),
      // exposes config variables globally to the application as `CFG`
      new webpack.DefinePlugin({
        CFG: JSON.stringify(config),
      }),
      new HtmlWebpackPlugin({
        hash: true,
        inject: false,
        template: "./src/assets.inc",
        filename: `${templates}/includes/assets.inc`,
        environment: environment,
        development: ifNotProduction(),
      }),
      // literally just copies non-webpack assets to public path
      new CopyWebpackPlugin({
        patterns: [{ from: "src/images", to: images }],
      }),
      //new BundleAnalyzerPlugin(),
    ]),
  };
};
