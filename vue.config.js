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
  devServer: {
    historyApiFallback: true, // 이 옵션을 추가하여 devServer가 history API fallback을 지원하도록 합니다.
  }
});
