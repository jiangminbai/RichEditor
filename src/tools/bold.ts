/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class Bold {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.bold);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    this.editor.restoreSelection();
    document.execCommand('bold');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'B'
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default Bold;