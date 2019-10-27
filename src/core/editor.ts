/**
 * 编辑器区域类
 */
import event from './emitter';

class Editor {
  el: HTMLElement;
  currentSelection: Selection;
  currentRange: Range;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'richeditor_area';
    this.el.setAttribute('contenteditable', 'true');
    container.appendChild(this.el);
    this.init();

    // this.el.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.el.addEventListener('mouseup', this.handleMouseup.bind(this));
    this.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    event.on('restorerange', this.restoreRange.bind(this));
    event.on('resetrange', this.resetRange.bind(this));
  }

  init() {
    this.currentSelection = window.getSelection();
    this.appendP();
    this.handleLine();
  }

  // 使编辑器内部填充p标签
  appendP() {
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    this.el.appendChild(p);
  }

  // 使编辑器内部始终存在一个p标签
  handleLine() {
    this.el.addEventListener('keydown', (e) => {
      setTimeout(() => {
        if (e.keyCode === 8 && this.el.querySelectorAll('p').length === 0) {
          this.appendP()
      }
      }, 100);
    })
  }

  // handleMouseDown() {
  //   this.currentSelection = this.currentSelection;
  // }

  handleMouseup() {
    this.currentRange = this.currentSelection.getRangeAt(0);
    event.fire('rangechange', this.currentRange);
  }

  handleMouseLeave() {
    if (this.currentSelection && this.currentSelection.rangeCount) {
      this.currentRange = this.currentSelection.getRangeAt(0);
      event.fire('rangechange', this.currentRange);
    }
  }

  restoreRange() {
    this.currentSelection.removeAllRanges();
    this.currentSelection.addRange(this.currentRange);
  }

  resetRange() {
    this.currentRange = this.currentSelection.getRangeAt(0);
  }
}

export default Editor;