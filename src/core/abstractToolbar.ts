import event from './emitter';
import registry from './registry';
import svgs from './svgs';

abstract class AbstractToolbar {
  el: HTMLElement;
  selected: boolean;
  tagName: string;
  registry: typeof registry;
  svgs: typeof svgs;

  constructor() {
    this.selected = false;
    this.tagName = 'div';
    this.registry = registry;
    this.svgs = svgs;
    this.createElement();

    this.el.addEventListener('click', this.handleClick.bind(this));
    event.on('rangechange', this.handleRangeChange.bind(this));
  }

  // 创建toolbar的按钮
  abstract create(): void;
  // toolbar按钮被点击
  abstract clicked(): void;

  createElement() {
    this.el = document.createElement('span');
    this.el.className = 'richeditor_toolbarItem';
    this.create();
  }

  handleClick() {
    this.changeActive();
    event.fire('restorerange');
    this.clicked();
    event.fire('resetrange');
  }

  handleRangeChange(currentRange) {
    const startContainer = currentRange.startContainer;
    const parent = startContainer.parentNode;
    const tagName = parent.tagName;
    tagName === this.tagName ? this.setActive() : this.resetActive();
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

export default AbstractToolbar;