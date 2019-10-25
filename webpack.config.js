const webpack = require('webpack');
const path = require('path');

// webpack配置对象
const webpackConfig = {
  // mode: 'development',
  entry: './src/core/RichEditor.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'RichEditor.js',
    library: 'RichEditor',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader'}
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
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
