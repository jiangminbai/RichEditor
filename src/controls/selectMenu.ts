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
  private list: Item[];
  public isShow: boolean = false;

  constructor(list: Item[]) {
    super();
    this.list = list;
    this.createElement(list);
    this.el.addEventListener('click', this.onClick.bind(this));
    document.body.addEventListener('click', (e) => {
      var insideMenu = this.el.contains(<HTMLElement>e.target) || this.el === e.target;
      if (!insideMenu && !this.inside(e)) this.hide();
    });
  }

  private createElement(list: Item[]) {
    this.el = document.createElement('div');
    this.el.className = 'rd_select-menu';
    const ul = document.createElement('ul');
    this.el.appendChild(ul);

    for(let i = 0; i < list.length; i++) {
      const li = document.createElement('li');
      li.textContent = list[i].label;
      ul.appendChild(li);
    }
  }

  private onClick(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
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
    this.isShow = true;
    document.body.appendChild(this.el);
  }

  public hide() {
    this.el.style.display = 'none';
    this.isShow = false;
  }

  public inside(e): boolean {
    return false;
  }

  public setActive(n: number): void {
    [].slice.call(this.el.querySelectorAll('li')).forEach((item, index) => {
      if (index === n) return item.classList.add('active');
      item.classList.remove('active');
    })
  }
}

export default SelectMenu;