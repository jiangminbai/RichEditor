/**
 * 文本居右
 */

import AbstractToolbar from '../core/abstractToolbar';

class JustifyRight extends AbstractToolbar {
  constructor() {
    super();
    // this.tagName = '';
  }

  create() {
    this.el.innerHTML = this.svgs["align-right"];
  }

  clicked() {
    document.execCommand('justifyRight');
  }
}

export default JustifyRight;