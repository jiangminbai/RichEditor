/**
 * 控件管理类
 */

import registry from './registry';
import Button from '../controls/button';
import Select from '../controls/select';
import SelectButton from '../controls/selectButton';
import SelectMenu from '../controls/selectMenu';
import ColorButton from '../controls/colorButton';
import ColorPicker from '../controls/colorPicker';

class Control {
  constructor() {
    registry.registerControl('button', Button);
    registry.registerControl('select', Select);
    registry.registerControl('selectButton', SelectButton);
    registry.registerControl('selectMenu', SelectMenu);
    registry.registerControl('colorPicker', ColorPicker);
    registry.registerControl('colorButton', ColorButton);
  }

  register(name: string, control) {
    registry.registerControl(name, control);
  }

  require(name: string) {
    return registry.requireControl(name);
  }
}

export default Control;