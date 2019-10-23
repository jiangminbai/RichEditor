import BaseToolbar from "../core/baseToolbar";
import event from '../core/emitter'

class Bold extends BaseToolbar {
  createToolbarElement() {
    const toolbar = document.createElement('span');
    toolbar.innerHTML = 'B';
    return toolbar;
  }

  getTagName() {
    return 'B';
  }

  execCommand(){
    document.execCommand('bold');
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