/**
 * 下划线
 */

import AbstractToolbar from '../core/abstractToolbar';

class Underline extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = 'U';
  }

  create() {
    this.el.innerHTML = this.svgs.underline;
  }

  clicked() {
    document.execCommand('underline');
  }
}

export default Underline;