/**
 * 颜色按钮类
 */

import Emitter from '../core/emitter';

class ColorButton extends Emitter {
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

  public setIcon(svg: string) {
    this.el.innerHTML = svg;
  }

  public setColor(rgb: string) {
    const rect = this.el.querySelector('rect');
    rect.setAttribute('fill', rgb);
    rect.setAttribute('stroke', rgb);
  }

  public getColor(): string {
    const rect = this.el.querySelector('rect');
    const fillColor = rect.getAttribute('fill');
    if (!fillColor) return 'rgb(0,0,0)';
    return fillColor;
  }
}

export default ColorButton;