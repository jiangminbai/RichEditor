/**
 * 选择器
 * @param
 * container: HTMLELEMENT
 * list: Item[]
 * @method
 * @event
 * itemClick selectText:string
 */

import Emitter from '../core/emitter';
import SelectButton from './selectButton';
import SelectMenu from './selectMenu';

interface Item {
  value: string,
  label: string
}

class Select extends Emitter {
  private selectButton: SelectButton;
  private selectMenu: SelectMenu;

  constructor(container: HTMLElement, list: Item[]) {
    super();

    this.selectButton = new SelectButton(container);
    this.selectButton.setText(list[0].label);
    this.selectMenu = new SelectMenu(list);
    this.selectMenu.setActive(0);
    this.selectMenu.inside = (e) => {
      return this.selectButton.el.contains(e.target) || this.selectButton === e.target;
    }

    this.selectButton.on('click', (e, coordinate, label) => {
      if (!this.selectMenu.isShow) {
        const index = list.findIndex(item => item.label === label);
        this.selectMenu.setActive(index);
        this.selectMenu.show(coordinate);
      } else {
        this.selectMenu.hide();
      }
    })

    this.selectMenu.on('itemClick', (item) => {
      this.selectButton.setText(item.label);
      this.fire('itemClick', item);
      this.selectMenu.hide();
    })
  }
}

export default Select;