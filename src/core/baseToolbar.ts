import event from './emitter';

abstract class BaseToolbar {
  el: HTMLElement;
  selected: boolean = false;

  constructor() {
    this.el = this.createToolbarElement();
    this.handleClick();
    event.on('rangechange', currentRange => {
      const startContainer = currentRange.startContainer;
      const parent = startContainer.parentNode;
      const tagName = parent.tagName;
      tagName === this.getTagName() ? this.setActive() : this.resetActive();
    })
  }

  abstract createToolbarElement(): HTMLElement

  abstract getTagName(): string;

  abstract execCommand(): void;

  handleClick() {
    this.el.addEventListener('click', () => {
      this.changeActive();
      event.fire('restorerange');
      this.execCommand();
      event.fire('resetrange');
    })
  }

  setActive() {
    this.el.classList.add('active');
    this.selected = true;
  }
  resetActive() {
    this.el.classList.remove('active');
    this.selected = false;
  }
  changeActive() {
    this.selected ? this.resetActive() : this.setActive();
  }
}

export default BaseToolbar;