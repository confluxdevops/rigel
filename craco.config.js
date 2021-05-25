module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  devServer: {
    proxy: {
      '/rpcshuttleflow': {
        target: 'https://test.shuttleflow.confluxnetwork.org',
        // target: 'https://shuttleflow.io',
        changeOrigin: true,
      },
      '/rpcsponsor': {
        target: 'https://test.shuttleflow.confluxnetwork.org',
        // target: 'https://shuttleflow.io',
        changeOrigin: true,
      },
    },
  },
}
