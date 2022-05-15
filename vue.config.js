module.exports = {
  devServer: {
    hot: true,
		port: 7777,
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true
    },
		proxy: {
			"/api": {
					target: "http://localhost:3000/",
					secure: false,
					changeOrigin: true,
					pathRewrite:{'/api': ''}
			},
		},
  },
  transpileDependencies:['@dcloudio/uni-ui']
}
