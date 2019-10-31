/**
 * 文本居中
 */

import AbstractToolbar from '../core/abstractToolbar';

class JustifyCenter extends AbstractToolbar {
  constructor() {
    super();
    // this.tagName = ''
  }

  create() {
    this.el.innerHTML= this.svgs["align-center"];
  }

  clicked() {
    document.execCommand('justifyCenter');
  }
}

export default JustifyCenter;