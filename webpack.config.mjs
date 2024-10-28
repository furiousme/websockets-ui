import path from 'node:path';
import nodeExternals from 'webpack-node-externals';

export default {
  entry: './index.js',
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.cjs',
    path: path.resolve('./dist'),
  },
};
