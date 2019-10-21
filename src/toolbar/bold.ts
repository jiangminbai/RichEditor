import Toolbar from "./toolbar";
import event from '../util/emitter'

class Bold extends Toolbar {
  constructor() {
    super();
    this.selected = false;
    this.el = document.querySelector('.menu-item-bold');
    this.handleClick();
    event.on('rangechange', currentRange => {
      const startContainer = currentRange.startContainer;
      const parent = startContainer.parentNode;
      const tagName = parent.tagName;
      tagName === 'B' ? this.setActive() : this.resetActive();
    })
  }

  handleClick() {
    this.el.addEventListener('click', () => {
      this.changeActive();
      event.fire('restorerange');
      document.execCommand('bold');
      event.fire('resetrange');
    })
  }
}

export default Bold;