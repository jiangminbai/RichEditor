/**
 * 删除线
 */

import AbstractToolbar from '../core/abstractToolbar';

class StrikeThrough extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = 'STRIKE';
  }

  create() {
    this.el.innerHTML = this.svgs["strike-through"];
  }

  clicked() {
    document.execCommand('strikeThrough');
  }
}

export default StrikeThrough;