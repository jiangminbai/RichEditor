/**
 * 有序列表
 */

import AbstractToolbar from '../core/abstractToolbar';

class OrderedList extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = 'OL';
  }

  create() {
    this.el.innerHTML = this.svgs["ordered-list"];
  }

  clicked() {
    document.execCommand('insertOrderedList');
  }
}

export default OrderedList;