import event from './emitter';
import registry from './registry';
import svgs from './svgs';

abstract class AbstractToolbar {
  el: HTMLElement;
  selected: boolean;
  tagName: string | string[];
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
    let node = startContainer;
    let tagNameChain = []; // 点击位置往上搜集的节点标签名链
    
    while((node = node.parentNode) && node.tagName !== 'P') {
      tagNameChain.push(node.tagName);
    }

    if (typeof this.tagName === 'string') {
      tagNameChain.indexOf(this.tagName) > -1 ? this.setActive() : this.resetActive();
    } else {
      let isSelected = this.tagName.some(item => {
        return tagNameChain.indexOf(item) > -1;
      })
      isSelected ? this.setActive() : this.resetActive();
    }
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