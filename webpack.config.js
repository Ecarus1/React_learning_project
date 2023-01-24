// Режим сборки development или production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// Опции webpack
let config = {
  context: path.join(__dirname, '/src'), // Директория с исходным кодом приложения
  entry: `index.js`, // Главный файл приложения
  output: {
    path: path.join(__dirname, 'dist'), // Куда и как делать сборку
    filename: '[name].js',
    clean: true, // Очистить ./dist от предыдущей сборки
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        IS_WEB: process.env.TARGET === 'web',
        IS_NODE: process.env.TARGET === 'node',
      },
    }),
    new MiniCssExtractPlugin(), // Сборка стилей в отдельный файл
    new HtmlWebPackPlugin({ // Создание dist/index.html с подключенной сборкой
      template: './index.html',
      filename: './index.html',
      base: '/',
    }),
  ],
  //
  resolve: {
    extensions: ['.js', '.jsx'], // Расширения по умолчанию, если не указаны в import
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], // Где искать файлы подключаемых модулей
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      // Транспиляция JS
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{loader: 'babel-loader'}],
      },
      // Возможность подключать css как модули, чтобы попали в сборку
      // С опцией modules при импорте стиля получаем объект с названиями ccs классов
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader, options: {}},
          {loader: 'css-loader', options: {url: true, import: true/*, modules: true*/}},
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          { loader: 'css-loader', options: { url: true, import: true } },
          { loader: 'less-loader', options: { lessOptions: {} } },
        ],
      },
      {
        test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset',
      },
    ],
  },
};

// Локальный сервер для отладки приложения
if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map';
  config.devServer = {
    static: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    port: 8020,
    // Прокси на апи, если режим разработки
    proxy: {
      '/api/**': {
        target: 'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      },
    },
  };
}

module.exports = config;
