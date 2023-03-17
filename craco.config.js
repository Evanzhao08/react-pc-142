//添加自定义webpack配置 
/* craco.config.js */
const path = require('path')
module.exports = {
  // webpack 配置
  webpack: {
    //配置别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}