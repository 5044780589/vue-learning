module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#26A097",
          // "link-color": "#2277DA",
          "error-color": "#f43434",
          "border-radius-base": "3px",
          "text-color": "#333333",
          "text-color-secondary": "#666666",
          "btn-default-color": "#359691",
          "btn-default-border": "#d4d4d4",
          // "font-family": "Tahoma,'Microsoft YaHei'",
          "modal-mask-bg": "fade(#000000, 40%)",
          "border-color-base": "#D0D0D0",
          "table-header-bg": "#eff2f7 !important",
          "table-header-color": "#333333"
        },
        javascriptEnabled: true
      }
    }
  },
  publicPath: "./",
  outputDir: "dist",
  devServer: {
    port: 8889,
    host: "0.0.0.0",
    https: false,
    open: true,
    proxy: {
      //开发环境代理配置  解决跨域问题  即不满足同源策略：协议，域名，端口号有一个不一致
      [process.env.VUE_APP_BASE_API]: {
        //用中括号括起来
        //目标服务器地址，代理访问'http://localhost:8001'
        target: process.env.VUE_APP_SERVICE_URL, //从配置文件中获取目标服务器地址
        changeOrigin: true, //开启代理服务器
        pathRewrite: {
          ///dev-api/db.josn  最后会发送http://localhost:8001/db.json,
          //将请求地址前缀/dev-api替换为空
          // '^/dev-api':'',
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  lintOnSave: true, //关闭格式检查
  productionSourceMap: false, //打包时不会生成.map文件，加快打包速度
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
};
