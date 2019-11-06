/**
 * 无序列表
 */

// import AbstractToolbar from '../core/abstractToolbar';

// class UnorderedList extends AbstractToolbar {
//   constructor() {
//     super();
//     this.tagName = 'UL';
//   }

//   create() {
//     this.el.innerHTML = this.svgs["unordered-list"];
//   }

//   clicked() {
//     document.execCommand('insertUnorderedList');
//   }
// }

// export default UnorderedList;
/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class UnorderedList {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs["unordered-list"]);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    // this.editor.restoreSelection();
    // document.execCommand('insertUnorderedList');
    this.editor.execCommand('insertUnorderedList');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'UL'
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default UnorderedList;