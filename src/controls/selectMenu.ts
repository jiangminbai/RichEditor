/**
 * 选择菜单
 * @param
 * list: Item[]
 * first: boolean
 * @method
 * show(coordinate: Coordinate): void;
 * hide(): void;
 * @event
 * itemClick item:Item
 */
import Emitter from '../core/emitter';

interface Coordinate {
  top: number,
  bottom: number,
  left: number,
  right: number
}

interface Item {
  value: string,
  label: string
}

class SelectMenu extends Emitter {
  private el: HTMLElement;
  private list: Item[]

  constructor(list: Item[], first: boolean) {
    super();
    this.list = list;
    this.createElement(list,first);
    this.el.addEventListener('click', this.onClick.bind(this));
    document.body.addEventListener('click', (e) => {
      if (e.target !== this.el) this.hide();
    })
  }

  private createElement(list: Item[], first: boolean) {
    this.el = document.createElement('div');
    this.el.className = 'richeditor_selectMenu';
    const ul = document.createElement('ul');
    this.el.appendChild(ul);

    for(let i = 0; i < list.length; i++) {
      const li = document.createElement('li');
      li.textContent = list[i].label;
      if (first && i === 0) li.className = 'selected';
      ul.appendChild(li);
    }
  }

  private onClick(e) {
    if (e.target.tagName === 'li') {
      this.selectItem(e.target);
      const index = [].slice.call(this.el.querySelectorAll('li')).findIndex(item => item === e.target);
      this.fire('itemClick', this.list[index]);
    }
  }

  private selectItem(li: HTMLElement) {
    const lis = this.el.querySelectorAll('li');
    lis.forEach(item => {
      if (item === li) item.className = 'selected';
      item.className = '';
    })
  }

  public show(coordinate: Coordinate) {
    this.el.style.left = coordinate.left + 'px';
    this.el.style.top = coordinate.bottom + 'px';
    this.el.style.display = 'block';
  }

  public hide() {
    this.el.style.display = 'none';
  }
}

export default SelectMenu;