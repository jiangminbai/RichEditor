/**
 * 删除线
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class StrikeThrough {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs["strike-through"]);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    this.editor.restoreSelection();
    document.execCommand('strikeThrough');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'STRIKE'
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default StrikeThrough;