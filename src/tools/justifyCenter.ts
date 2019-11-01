/**
 * 文本居中
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class JustifyCenter {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs["align-center"]);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    this.editor.restoreSelection();
    document.execCommand('JustifyCenter');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'style',
      value: {
        textAlign: 'center'
      }
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default JustifyCenter;