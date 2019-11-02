const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// webpack配置对象
const webpackConfig = {
  // mode: 'development',
  entry: {
    'richEditor.js': './src/core/richEditor.ts',
    'rich-editor': './src/styles/rich-editor.scss'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
    library: 'RichEditor',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader'},
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    extensions: ['.scss', '.ts', '.js', '.json']
  },
  devtool: 'source-map'
}

// 编译器
const compiler = webpack(webpackConfig);

// 运行编译器
compiler.run((err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  console.log(stats.toString({
    colors: true    // 在控制台展示颜色
  }));
})
