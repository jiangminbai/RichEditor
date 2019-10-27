import AbstractToolbar from "./abstractToolbar"

/**
 * 插件注册器：微核通过此注册器来管理工具插件
 */

// 插件类型
interface Plugin {
  name: string,
  module: AbstractToolbar
}

// 插件管理器类
class Registry {
  plugins: Plugin[] = [];

  registryPlugin(name:string, toolbar: AbstractToolbar) {
    this.plugins.push({
      name,
      module: toolbar
    })
  }

  require(name: string) {
    return this.plugins.find(plugin => plugin[name]);
  }
}

export default new Registry();