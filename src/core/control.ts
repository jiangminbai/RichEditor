/**
 * 控件管理类
 */

import registry from './registry';
import Button from '../controls/button';

class Control {
  constructor() {
    registry.registerControl('button', Button);
  }

  register(name: string, control) {
    registry.registerControl(name, control);
  }

  require(name: string) {
    return registry.requireControl(name);
  }
}

export default Control;