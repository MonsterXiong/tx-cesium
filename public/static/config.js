/**
 * 应用运行时配置
 * 部署后可直接修改此文件来自定义配置项，无需重新构建
 *
 * 配置优先级：
 *   - 生产环境：此文件 > 环境变量（构建时注入）
 *   - 开发环境：环境变量 > 此文件
 *
 * 值为 undefined 时将回退使用环境变量中的配置
 */
window.__APP_CONFIG__ = {
  // 后端 API 地址，例如 'http://192.168.1.100:8080/api'
  baseApi: undefined,

  // 系统名称，显示在浏览器标签页标题
  systemName: '系统名称',

  // Cesium 三维地图配置
  cesium: {
    // Cesium Ion 访问令牌
    accessToken: undefined,
    // 自定义影像服务地址（如天地图、ArcGIS Server 等）
    imageryUrl: undefined,
  },
}
