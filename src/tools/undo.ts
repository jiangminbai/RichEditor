/**
 * 撤销
 */

import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class Undo {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.undo);

    this.button.on('click', this.onClick.bind(this));
  }

  onClick(){
    // document.execCommand('undo');
    // this.editor.fireRangeChange();
    this.editor.execCommand('undo');
  }
}

export default Undo;