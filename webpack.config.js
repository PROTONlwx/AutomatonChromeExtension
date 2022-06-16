const path = require('path');

module.exports = {
  entry: {
    action: './scripts/action.ts',
    background: './scripts/background.ts',
    mousedown: './scripts/mousedown.ts',
    popup: './scripts/popup.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
