module.exports = {
  devServer: {
    hot: true,
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true
    }
  },
  transpileDependencies:['@dcloudio/uni-ui']
}
