// tslint:disable:no-console

const replace = require('replace')

import * as webpack from 'webpack'
import * as path from 'path'

// import BailPlugin from 'zotero-plugin/plugin/bail'

import CircularDependencyPlugin = require('circular-dependency-plugin')
import AfterBuildPlugin = require('zotero-plugin/plugin/after-build')
import TranslatorHeaderPlugin = require('./setup/plugins/translator-header')

const translators = require('./gen/translators.json')
const _ = require('lodash')

const common = {
  mode: 'production',
  optimization: {
    minimize: false,
    concatenateModules: false,
    noEmitOnErrors: true,
    namedModules: true,
    namedChunks: true,
    runtimeChunk: false,
  },

  node: { fs: 'empty' },
  resolveLoader: {
    alias: {
      'pegjs-loader': 'zotero-plugin/loader/pegjs',
      'json-jsesc-loader': 'zotero-plugin/loader/json',
      'wrap-loader': 'zotero-plugin/loader/wrap',
      'bcf-loader': path.join(__dirname, './setup/loaders/bcf.ts'),
    },
  },
  module: {
    rules: [
      { test: /\.pegjs$/, use: [ 'pegjs-loader' ] },
      { test: /\.json$/, type: 'javascript/auto', use: [ 'json-jsesc-loader' ] }, // https://github.com/webpack/webpack/issues/6572
      { test: /\.bcf$/, use: [ 'bcf-loader' ] },
      { test: /\.ts$/, exclude: [ /node_modules/ ], use: [ 'wrap-loader', 'ts-loader' ] },
    ],
  },
}

const config: webpack.Configuration[] = []

config.push(
  // main app logic
  _.merge({}, common, {
    optimization: {
      runtimeChunk: { name: 'runtime' },
      // new webpack.optimize.CommonsChunkPlugin({ minChunks: 2, name: 'common', filename: 'common.js' }),
      splitChunks: {
        chunks: 'all',
        name: true,
        cacheGroups: {
          runtime: {
            test: /\/node_modules\//,
            priority: 1,
            name: 'runtime',
            minChunks: 2000000000,
          },
          common: {
            priority: 2,
            name: 'common',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        }
      },
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new CircularDependencyPlugin({ failOnError: true }),
      /*
      new AfterBuildPlugin((stats, options) => {
        const ccp = options.plugins.find(plugin => plugin instanceof webpack.optimize.CommonsChunkPlugin).filenameTemplate
        replace({
          regex: `window\\["${options.output.jsonpFunction}"\\]`,
          replacement: options.output.jsonpFunction,
          paths: [path.join(options.output.path, ccp)],
        })
      }),
      */
      // BailPlugin,
    ],

    context: path.resolve(__dirname, './content'),
    entry: {
      BetterBibTeX: './BetterBibTeX.ts',
      'BetterBibTeX.KeyManager': './KeyManager.ts',
      'BetterBibTeX.TestSupport': './TestSupport.ts',
      'BetterBibTeX.Preferences': './Preferences.ts',
      'BetterBibTeX.ErrorReport': './ErrorReport.ts',
      'BetterBibTeX.FirstRun': './FirstRun.ts',
      'BetterBibTeX.ItemPane': './ItemPane.ts',
      'BetterBibTeX.ExportOptions': './ExportOptions.ts',
    },
    // devtool: '#source-map',
    output: {
      path: path.resolve(__dirname, './build/content'),
      filename: '[name].js',
      jsonpFunction: 'Zotero.WebPackedBetterBibTeX',
      // chunkFilename: "[id].chunk.js",
      devtoolLineToLine: true,
      // sourceMapFilename: "./[name].js.map",
      pathinfo: true,
      library: 'Zotero.[name]',
      libraryTarget: 'assign',
    },
  })
)

for (const label of Object.keys(translators.byName)) {
  config.push(
    _.merge({}, common, {
      plugins: [
        new CircularDependencyPlugin({ failOnError: true }),
        new TranslatorHeaderPlugin(label),
        // BailPlugin,
      ],
      context: path.resolve(__dirname, './resource'),
      entry: { [label]: `./${label}.ts` },

      output: {
        path: path.resolve(__dirname, './build/resource'),
        filename: '[name].js',
        devtoolLineToLine: true,
        pathinfo: true,
      },
    })
  )
}

export default config
