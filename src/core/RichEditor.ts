import event from "./emitter";
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
  currentSelection: Selection = null;
  currentRange: Range = null;
  registry: Registry = new Registry(); // 插件管理器
  
  constructor(options: Options) {
    if (!options.el) throw Error('el option is must');

    this.el = options.el;
    this.initEditor();
    this.installToolbar();
  }

  initEditor() {
    this.appendP();
    this.handleLine();
    this.handleMouseDown();
    this.handleMouseLeave();
    this.handleMouseup();

    event.on('restorerange', this.restoreRange.bind(this));
    event.on('resetrange', this.resetRange.bind(this));
  }

  installToolbar() {
    const toolbarContainer = document.createElement('div');
    toolbarContainer.classList.add('richeditor_toolbarmenu');
    this.el.appendChild(toolbarContainer);

  }

  registerPlugin(name: string, toolbar: BaseToolbar) {
    this.registry.registryPlugin(name, toolbar);
  }

  appendP() {
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    this.el.appendChild(p);
  }

  handleLine() {
    this.el.addEventListener('keydown', (e) => {
      setTimeout(() => {
        if (e.keyCode === 8 && this.el.querySelectorAll('p').length === 0) {
          this.appendP()
      }
      }, 100);
    })
  }

  handleMouseDown() {
    this.el.addEventListener('mousedown', () => {
      this.currentSelection = this.currentSelection || window.getSelection();
    })
  }

  handleMouseup() {
    this.el.addEventListener('mouseup', () => {
      this.currentRange = this.currentSelection.getRangeAt(0);
      event.fire('rangechange', this.currentRange);
    })
  }

  handleMouseLeave() {
    this.el.addEventListener('mouseleave', () => {
      if (this.currentSelection) {
        this.currentRange = this.currentSelection.getRangeAt(0);
        event.fire('rangechange', this.currentRange);
      }
    })
  }

  restoreRange() {
    this.currentSelection.removeAllRanges();
    this.currentSelection.addRange(this.currentRange);
  }

  resetRange() {
    this.currentRange = this.currentSelection.getRangeAt(0);
  }
}

export default RichEditor;