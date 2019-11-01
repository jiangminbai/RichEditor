/**
 * 选择器
 */

import Emitter from '../core/emitter';
import SelectButton from './selectButton';
import SelectMenu from './selectMenu';

interface Item {
  value: string,
  label: string
}

class Select extends Emitter {
  selectButton: SelectButton;
  selectMenu: SelectMenu;

  constructor(container: HTMLElement, list: Item[]) {
    super();

    this.selectButton = new SelectButton(container);
    this.selectButton.setText(list[0].label);
    this.selectMenu = new SelectMenu(list, true);

    this.selectButton.on('click', (e, isShow, coordinate) => {
      if (isShow) {
        this.selectMenu.show(coordinate);
      } else {
        this.selectMenu.hide();
      }
    })

    this.selectMenu.on('itemClick', (selectText) => {
      this.selectButton.setText(selectText);
      this.fire('itemClick', selectText);
    })
  }
}

export default Select;