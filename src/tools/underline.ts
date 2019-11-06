/**
 * 下划线
 */

import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class Underline {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.underline);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    // this.editor.restoreSelection();
    // document.execCommand('underline');
    this.editor.execCommand('underline');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'U'
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default Underline;