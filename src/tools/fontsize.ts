/**
 * 字号
 */
/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Select from '../controls/select';

class FontSize {
  editor: Editor;
  select: Select;
  

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;
    const options = [
      { label: 'x-small', value: '1' },
      { label: 'small', value: '2' },
      { label: 'medium', value: '3' },
      { label: 'large', value: '4' },
      { label: 'x-large', value: '5' },
      { label: 'xx-large', value: '6' },
      { label: 'xxx-large', value: '7' },
    ]

    const Select = control.require('select');
    this.select = new Select(toolbar.el, options);

    this.select.on('itemClick', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(item){
    this.editor.restoreSelection();
    document.execCommand('fontSize', false, item.value);
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'B'
    })
  }
}

export default FontSize;