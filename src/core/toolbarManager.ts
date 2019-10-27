/**
 * 工具栏管理类
 */

import registry from './registry';
import Bold from '../toolbar/bold';
import Italic from '../toolbar/italic';
import Underline from '../toolbar/underline';
import StrikeThrough from '../toolbar/strikeThrough';
import JustifyLeft from '../toolbar/justifyLeft';
import JustifyCenter from '../toolbar/justifyCenter';
import JustifyRight from '../toolbar/justifyRight';
import OrderedList from '../toolbar/orderedList';
import UnorderedList from '../toolbar/unorderedList';

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
      },
      {
        name: 'justify-left',
        module: new JustifyLeft()
      },
      {
        name: 'justify-center',
        module: new JustifyCenter()
      },
      {
        name: 'justify-right',
        module: new JustifyRight()
      },
      {
        name: 'ordered-list',
        module: new OrderedList()
      },
      {
        name: 'unordered-list',
        module: new UnorderedList()
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