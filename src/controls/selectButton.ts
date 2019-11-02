/**
 * 选择按钮
 * @param
 * container: HTMLELEMENT
 * @method
 * setText(text: string): void;
 * @event
 * click  e, isShow: boolean, coordinate: Coordinate
 */
import Emitter from '../core/emitter';
import svgs from '../core/svgs';

class SelectButton extends Emitter {
  public el: HTMLElement;
  private textSpan: HTMLElement;
  private icon: HTMLElement;

  constructor(container: HTMLElement) {
    super();
    this.el = document.createElement('div');
    this.textSpan = document.createElement('div');
    this.icon = document.createElement('div');

    this.el.className = 'richeditor_toolbarItem rd_select-btn';
    this.textSpan.className = 'rd_select-btn-text';
    this.icon.className = 'rd_select-btn-icon';

    container.appendChild(this.el);
    this.el.appendChild(this.textSpan);
    this.el.appendChild(this.icon);

    this.setIcon(svgs["chevron-down"]);

    this.el.addEventListener('click', (e) => {
      var coordinate = this.el.getBoundingClientRect();
      this.fire('click', e, coordinate, this.textSpan.textContent);
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