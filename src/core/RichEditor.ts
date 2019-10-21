import event from "../util/emitter";
import Bold from '../toolbar/bold';

class RichEditor {
  el: HTMLElement;
  currentSelection: Selection = null;
  currentRange: Range = null;

  constructor() {
    this.el = document.querySelector('.rich-editor_container');
    this.initEditor();
    this.initToolbar();
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

  initToolbar() {
    new Bold();
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