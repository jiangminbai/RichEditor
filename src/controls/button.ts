/**
 * 按钮类
 */

import Emitter from '../core/emitter';

class Button extends Emitter {
  el: HTMLElement;

  constructor(container) {
    super();
    this.el = document.createElement('div');
    this.el.className = 'richeditor_toolbarItem';
    container.appendChild(this.el);

    this.el.addEventListener('click', (e) => {
      this.fire('click', e);
    })
  }

  setIcon(svg: string) {
    this.el.innerHTML = svg;
  }

  setActive() {
    this.el.classList.add('active');
  }

  resetActive() {
    this.el.classList.remove('active');
  }
}

export default Button;