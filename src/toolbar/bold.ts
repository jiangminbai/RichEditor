/**
 * 粗体
 */
import AbstractToolbar from "../core/abstractToolbar";

class Bold extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = 'B';
  }

  create() {
    this.el.innerHTML = this.svgs.bold;
  }

  clicked(){
    document.execCommand('bold');
  }
}

export default Bold;