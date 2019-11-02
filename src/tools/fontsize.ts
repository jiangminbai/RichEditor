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

    const Select = control.require('select');
    this.select = new Select(toolbar.el, [{value: '14px', label: '14px'}]);

    this.select.on('itemClick', this.onClick.bind(this));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(item){
    this.editor.restoreSelection();
    document.execCommand('bold');
  }

  onRangeChange() {
    const isMatch = this.editor.match({
      type: 'tagName',
      value: 'B'
    })
  }
}

export default FontSize;