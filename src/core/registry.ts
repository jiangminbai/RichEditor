import BaseToolbar from "./baseToolbar"

/**
 * 插件管理器：微核通过此管理器来管理和查找插件
 */

// 插件类型
 class Plugins {
  [key: string]: BaseToolbar;
}

// 插件管理器类
class Registry {
  plugins: Plugins = {};

  registryPlugin(name:string, toolbar: BaseToolbar) {
    this.plugins[name] = toolbar;
  }

  find(name: string) {
    return this.plugins[name];
  }
}

export default Registry;