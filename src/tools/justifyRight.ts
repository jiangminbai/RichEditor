/**
 * 文本居右
 */

// import AbstractToolbar from '../core/abstractToolbar';

// class JustifyRight {
//   constructor() {
//     super();
//     // this.tagName = '';
//   }

//   create() {
//     this.el.innerHTML = this.svgs["align-right"];
//   }

//   clicked() {
//     document.execCommand('justifyRight');
//   }
// }

// export default JustifyRight;
/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class JustifyRight {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs["align-right"]);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    this.editor.restoreSelection();
    document.execCommand('JustifyRight');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'style',
      value: {
        textAlign: 'right'
      }
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default JustifyRight;