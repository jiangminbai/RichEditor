import AbstractToolbar from '../core/abstractToolbar';

class Italic extends AbstractToolbar {
  constructor() {
    super();
    this.tagName = ['I', 'EM'];
  }

  create() {
    this.el.innerHTML = this.svgs.italic;
  }

  clicked() {
    document.execCommand('italic');
  }
}

export default Italic;