const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 压缩css
const OptimizeCSSASSETPlugin = require('optimize-css-assets-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
// development   production
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:6].js'
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          getCustomTransformers: () => ({
            before: [ tsImportPluginFactory({
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: 'css'
            })]
          }),
        },
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, "css-loader", {
          loader: "postcss-loader",
          options: {
            plugins: () => [require('autoprefixer')]
          }
        }]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", {
          loader: "postcss-loader",
          options: {
            plugins: () => [require('autoprefixer')]
          }
        }, "less-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000, // 50kb
            outputPath: 'imgs' // 打包处的图片保存路径
          }
        }]
      },
      { // 处理字体等文件
        test: /\.(eot|ttf|woff|woff2|mp4|avi)$/,
        loader: 'file-loader'
      }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8902,
    host: 'localhost',
    hot: true,
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // html模版压缩，去除空格键
        collapseWhitespace: true,
        // 删除属性的双引号
        removeAttributeQuotes: true,
        // 删除注释
        removeComments: true,
      },
      chunksSortMode: 'none'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  optimization: {
    minimizer: [
      // 压缩 js
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSASSETPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          reduceIdent: false,
          autoprefixer: false
        }
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
};
