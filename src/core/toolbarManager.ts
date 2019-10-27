/**
 * 工具栏管理类
 */

import registry from './registry';
import Bold from '../toolbar/bold';
import Italic from '../toolbar/italic';
import Underline from '../toolbar/underline';
import StrikeThrough from '../toolbar/strikeThrough';

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
      },
      {
        name: 'italic',
        module: new Italic()
      },
      {
        name: 'underline',
        module: new Underline()
      },
      {
        name: 'strike-through',
        module: new StrikeThrough()
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