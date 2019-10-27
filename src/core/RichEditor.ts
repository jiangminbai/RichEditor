/**
 * 富文本编辑器类
 */

import AbstractToolbar from './abstractToolbar';
import registry from './registry';
import ToolbarManager from './toolbarManager';
import Editor from './editor';
import svgs from './svgs';

// 参数接口
interface Options {
  el: HTMLElement;
}

class RichEditor {
  public static Toolbar: typeof AbstractToolbar = AbstractToolbar; // 给工具栏提供接口
  
  el: HTMLElement;
  svgs: typeof svgs;
  registry: typeof registry; // 插件管理器
  toolbarManager: ToolbarManager;
  editor: Editor; // 编辑器区域
  
  constructor(options: Options) {
    if (!options.el) throw Error('el option is must');

    this.el = options.el;
    this.svgs = svgs;
    this.registry = registry;
    this.toolbarManager = new ToolbarManager(this.el);
    this.editor = new Editor(this.el);
  }

  // 对外提供增加svg的接口
  addIcon(name: string, svg: string) {
    this.svgs[name] = svg;
  }

  // 对外提供注册插件的接口
  registerPlugin(name: string, toolbar: AbstractToolbar) {
    this.registry.registryPlugin(name, toolbar);
    this.toolbarManager.el.appendChild(toolbar.el);
  }
  
}

export default RichEditor;