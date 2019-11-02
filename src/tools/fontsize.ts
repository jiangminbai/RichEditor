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
  options: any;
  

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;
    this.options = [
      { label: 'x-small', value: '1' },
      { label: 'small', value: '2' },
      { label: 'medium', value: '3' },
      { label: 'large', value: '4' },
      { label: 'x-large', value: '5' },
      { label: 'xx-large', value: '6' },
      { label: 'xxx-large', value: '7' },
    ]

    const Select = control.require('select');
    this.select = new Select(toolbar.el, this.options);
    this.select.on('itemClick', this.onClick.bind(this));

    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(item){
    this.editor.restoreSelection();
    document.execCommand('fontSize', false, item.value);
  }

  onRangeChange() {
    const size = this.editor.match({
      type: 'tagNameAttribute',
      tagName: 'FONT',
      attribute: 'size',
      value: ['1', '2', '3', '4', '5', '6', '7']
    })
    if (size) {
      const item = this.options.find(it => it.value === size);
      this.select.setValue(item);
    }
  }
}

export default FontSize;