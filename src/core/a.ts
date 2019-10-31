
abstract class AbstractToolbar {
  el: HTMLElement;
  selected: boolean;
  tagName: string | string[];

  constructor() {
    this.selected = false;
    this.tagName = 'div';
    this.createElement();

    this.el.addEventListener('click', this.handleClick.bind(this));
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
    // event.fire('restorerange');
    this.clicked();
  }

  setActive() {
    this.el.classList.add('active');
    this.selected = true;
  }

  resetActive() {
    this.el.classList.remove('active');
    this.selected = false;
  }
}

export default AbstractToolbar;