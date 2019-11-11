/**
 * 富文本编辑器类
 */

import Toolbar from './toolbar';
import Control from './control';
import Editor from './editor';
import svgs from './svgs';

// 参数接口
interface Options {
  el: HTMLElement;
}

class RichEditor {
  el: HTMLElement;
  svgs: typeof svgs; // 图标管理器
  toolbar: Toolbar; // 工具栏管理器
  control: Control; // 控件管理器
  editor: Editor; // 编辑器区域
  
  constructor(options: Options) {
    if (!options.el) throw Error('el option is must');

    this.el = options.el;
    this.svgs = svgs;
    this.control = new Control();
    this.toolbar = new Toolbar(this.el);
    this.editor = new Editor(this.el);

    // 注册内置工具栏插件
    this.toolbar.registerPlugins(this);
  }
}

export default RichEditor;