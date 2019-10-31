/**
 * 插件注册器：微核通过此注册器来管理工具插件
 */

// 插件类型
interface Plugin {
  name: string,
  module: any
}

// 插件管理器类
class Registry {
  plugins: Plugin[] = [];
  controls: any = {};

  registerPlugin(name:string, toolbar) {
    this.plugins.push({
      name,
      module: toolbar
    })
  }

  requirePlugin(name: string) {
    return this.plugins.find(plugin => plugin[name]);
  }

  registerControl(name: string, control) {
    this.controls[name] = control;
  }

  requireControl(name: string) {
    return this.controls[name];
  }
}

export default new Registry();