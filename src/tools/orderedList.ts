/**
 * 有序列表
 */

// import AbstractToolbar from '../core/abstractToolbar';

// class OrderedList extends AbstractToolbar {
//   constructor() {
//     super();
//     this.tagName = 'OL';
//   }

//   create() {
//     this.el.innerHTML = this.svgs["ordered-list"];
//   }

//   clicked() {
//     document.execCommand('insertOrderedList');
//   }
// }

// export default OrderedList;

/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Button from '../controls/button';

class OrderedList {
  editor: Editor;
  button: Button;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs["ordered-list"]);

    this.button.on('click', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(){
    // this.editor.restoreSelection();
    // document.execCommand('insertOrderedList');
    this.editor.execCommand('insertOrderedList');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'OL'
    })
    isMatch ? this.button.setActive() : this.button.resetActive();
  }
}

export default OrderedList;