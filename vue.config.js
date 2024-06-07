const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      });
      return definitions;
    });
  },
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://port-0-backend-and8yv2klx4clqjs.sel5.cloudtype.app',
  //       changeOrigin: true,
  //       secure: false,
  //       logLevel: 'debug', // 추가: 디버그 레벨 로그
  //     },
  //   },
  // },
});
