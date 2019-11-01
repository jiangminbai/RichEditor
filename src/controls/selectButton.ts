/**
 * 选择按钮
 */
import Emitter from '../core/emitter';
import svgs from '../core/svgs';

class SelectButton extends Emitter {
  el: HTMLElement;
  private textSpan: HTMLElement;
  private icon: HTMLElement;
  private clickCount: number = 0;

  constructor(container: HTMLElement) {
    super();
    this.el = document.createElement('div');
    this.el.className = 'richeditor_toolbarItem';
    container.appendChild(this.el);

    this.textSpan = document.createElement('div');
    this.icon = document.createElement('div');
    this.el.appendChild(this.textSpan);
    this.el.appendChild(this.icon);

    this.setIcon(svgs["chevron-down"]);

    this.el.addEventListener('click', (e) => {
      var coordinate = this.el.getBoundingClientRect();
      this.clickCount++;
      const isShow = !!(this.clickCount % 2);
      this.fire('click', e, isShow, coordinate);
    })
  }

  private setIcon(svg: string) {
    this.icon.innerHTML = svg;
  }

  public setText(text: string) {
    this.textSpan.textContent = text;
  } 
}

export default SelectButton;