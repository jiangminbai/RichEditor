/**
 * 工具栏管理类
 */

import registry from './registry';
import AbstractToolbar from './abstractToolbar';
import Bold from '../toolbar/bold';

interface Plugins {
  [name: string]: AbstractToolbar;
}

class ToolbarManager {
  el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'richeditor_toolbar';
    container.appendChild(this.el);

    this.registryPlugins();
    this.mountDOM();
  }

  // 注册插件列表
  registryPlugins() {
    const plugins = [
      {
        name: 'bold',
        module: new Bold()
      }
    ]

    plugins.forEach(plugin => {
      registry.registryPlugin(plugin.name, plugin.module);
    })
  }

  // 将插件挂载到dom上
  mountDOM() {
    const plugins = registry.plugins;
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      this.el.appendChild(plugin.module.el);
    }
  }
}

export default ToolbarManager;