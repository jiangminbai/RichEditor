import AbstractToolbar from "../core/abstractToolbar";

class Bold extends AbstractToolbar {
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