/**
 * 工具栏类
 */

import registry from './registry';
import RichEditor from './richEditor';
import Undo from '../tools/undo';
import Redo from '../tools/redo';
import Bold from '../tools/bold';
import Italic from '../tools/italic';
import Underline from '../tools/underline';
import StrikeThrough from '../tools/strikeThrough';
import JustifyLeft from '../tools/justifyLeft';
import JustifyCenter from '../tools/justifyCenter';
import JustifyRight from '../tools/justifyRight';
import OrderedList from '../tools/orderedList';
import UnorderedList from '../tools/unorderedList';
import FontSize from '../tools/fontsize';
import FontName from '../tools/fontname';
import ForeColor from '../tools/foreColor';

class Toolbar {
  el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'richeditor_toolbar';
    container.appendChild(this.el);
  }

  // 注册插件列表
  registerPlugins(editor: RichEditor) {
    const plugins = [
      {
        name: 'undo',
        module: new Undo()
      },
      {
        name: 'redo',
        module: new Redo()
      },
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
        name: 'ordered-list',
        module: new OrderedList()
      },
      {
        name: 'unordered-list',
        module: new UnorderedList()
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
        name: 'fontsize',
        module: new FontSize()
      },
      {
        name: 'fontname',
        module: new FontName()
      },
      {
        name: 'forecolor',
        module: new ForeColor()
      }
    ]

    plugins.forEach(plugin => {
      this.register(plugin.name, plugin.module);
      if (plugin.module.install) plugin.module.install(editor);
    })
  }
  
  register(name: string, toolbar) {
    registry.registerPlugin(name, toolbar);
  }

  require(name: string) {
    return registry.requirePlugin(name);
  }
}

export default Toolbar;