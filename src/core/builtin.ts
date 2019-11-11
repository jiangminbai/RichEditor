/**
 * 控件管理类
 */

import registry from './registry';
import Editor from './editor';

import ImageScale from '../builtins/imageScale';


class Builtin {
  constructor(editor: Editor) {
    registry.registerComponent('imageScale', new ImageScale(editor));
  }

  register(name: string, component) {
    registry.registerComponent(name, component);
  }

  require(name: string) {
    return registry.requireComponent(name);
  }
}

export default Builtin;