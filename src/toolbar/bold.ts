import BaseToolbar from "../core/baseToolbar";
import event from '../core/emitter'

class Bold extends BaseToolbar {
  getTagName() {
    return 'B';
  }

  createToolbarElement() {
    const toolbar = document.createElement('span');
    toolbar.innerHTML = 'B';
    return toolbar;
  }

  execCommand(){
    document.execCommand('bold');
  }
}

export default Bold;