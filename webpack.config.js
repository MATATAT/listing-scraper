import path from 'path';
import url from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const { NODE_ENV = 'production' } = process.argv;

const config = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node16.15',
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
        extensions: ['.ts', '.tsx', '.js'],
    },
    optimization: {
        // TODO: Look into not having to do this (mangled names issues)
        minimize: false
    },
    output: {
        filename: 'index.js',
        path: path.resolve(url.fileURLToPath(new URL('.', import.meta.url)), 'dist'),
        library: {
            type: 'module'
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: '*.json',
                    to: '.',
                    context: './src/',
                },
            ],
        }),
    ],
    experiments: {
        outputModule: true,
    },
};

export default config;
