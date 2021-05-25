const TestServerUrl = 'https://test.shuttleflow.confluxnetwork.org'
const ProxyConfig = {
  target: TestServerUrl,
  // target: 'https://shuttleflow.io',
  changeOrigin: true,
}

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
    host: 'localhost',
    proxy: {
      '/rpcshuttleflow': ProxyConfig,
      '/rpcsponsor': ProxyConfig,
    },
  },
}
