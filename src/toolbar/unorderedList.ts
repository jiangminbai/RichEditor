/**
 * 无序列表
 */

import AbstractToolbar from '../core/abstractToolbar';

class UnorderedList extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = 'UL';
  }

  create() {
    this.el.innerHTML = this.svgs["unordered-list"];
  }

  clicked() {
    document.execCommand('insertUnorderedList');
  }
}

export default UnorderedList;