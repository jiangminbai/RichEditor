/**
 * 富文本编辑器类
 */

import Editor from './editor';
import BaseToolbar from './baseToolbar';
import Bold from '../toolbar/bold';
import Registry from './registry';

// 参数接口
interface Options {
  el: HTMLElement;
}

class RichEditor {
  public static Toolbar: typeof BaseToolbar = BaseToolbar; // 给工具栏提供接口
  
  el: HTMLElement;
  registry: Registry = new Registry(); // 插件管理器
  editor: Editor; // 编辑器区域
  
  constructor(options: Options) {
    if (!options.el) throw Error('el option is must');

    this.el = options.el;
    this.editor = new Editor(this.el);
    this.installToolbar();
  }

  installToolbar() {
    const toolbarContainer = document.createElement('div');
    toolbarContainer.className = 'richeditor_toolbarmenu';
    this.el.appendChild(toolbarContainer);
  }

  registerPlugin(name: string, toolbar: BaseToolbar) {
    this.registry.registryPlugin(name, toolbar);
  }
}

export default RichEditor;