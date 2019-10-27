/**
 * 文本居左
 */

import AbstractToolbar from '../core/abstractToolbar';

class JustifyLeft extends AbstractToolbar {
  constructor() {
    super();
    // this.tagName = ''
  }

  create() {
    this.el.innerHTML = this.svgs["align-left"];
  }

  clicked() {
    document.execCommand('justifyLeft');
  }
}

export default JustifyLeft;