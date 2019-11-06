/**
 * 恢复
 */

import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class Redo {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.redo);

    this.button.on('click', this.onClick.bind(this));
  }

  onClick(){
    // document.execCommand('redo');
    // this.editor.fireRangeChange();
    this.editor.execCommand('redo');
  }
}

export default Redo;

