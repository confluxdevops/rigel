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
    liveReload: false,
    host: 'localhost',
    proxy: {
      '/rpcshuttleflow': {
        target: 'https://test.shuttleflow.confluxnetwork.org/rpcshuttleflow',
        // target: 'https://shuttleflow.io/rpcshuttleflow',
        changeOrigin: true,
        pathRewrite: {
          '/rpcshuttleflow': '',
        },
      },
      '/rpcsponsor': {
        target: 'https://test.shuttleflow.confluxnetwork.org/rpcsponsor',
        // target: 'https://shuttleflow.io/rpcsponsor',
        changeOrigin: true,
        pathRewrite: {
          '/rpcsponsor': '',
        },
      },
    },
  },
}
