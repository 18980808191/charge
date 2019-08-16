const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  publicPath:'/charge',
  // 输出目录
  outputDir: 'dist',
  lintOnSave: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  // alias 配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))

  },
  //简单的方式
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        minRatio: 0.8,
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 2048
      })
    ]
  },
  // 高级的方式
  // configureWebpack: config => {
  //     if (process.env.NODE_ENV === 'production') {
  //         // 生产环境
  //         config.plugins.push(
  //             new CompressionWebpackPlugin({
  //                 filename: '[path].gz[query]',
  //                 algorithm: 'gzip',
  //                 test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  //                 threshold: 10240,
  //                 minRatio: 0.8
  //             })
  //         );

  //     } else {
  //         // 开发环境
  //     }
  // },
  // CSS 相关选项
  css: {
    extract: true,
    // 是否开启 CSS source map？
    sourceMap: false,
    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    modules: false,
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 37.5
          })
        ]
      }
    }
  },
  // 在多核机器下会默认开启。
  //parallel: require('os').cpus().length > 1,
  // PWA 插件的选项。   
  // pwa: {},
  // 配置 webpack-dev-server 行为。
  devServer: {
      open: process.env.NODE_ENV === "development",
      host: 'localhost',
      port: 8080,
      https: false,
      hotOnly: false,
      proxy: {
        '/': {
            target: 'http://mpintf.paas.sc.ctc.com',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
              '^/': ''
            }
        }
    },
      before: app => {}
  },
  // 第三方插件的选项
  pluginOptions: {}
}