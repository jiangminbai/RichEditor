/**
 * 字号
 */
/**
 * 粗体
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import Select from '../controls/select';

class FontName {
  editor: Editor;
  select: Select;
  options: any;
  

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;
    this.options = [
      { label: '微软雅黑', value: 'Microsoft-YaHei' },
      { label: '仿宋', value: 'FangSong' },
      { label: '楷体', value: 'KaiTi' },
      { label: '宋体', value: 'SimSun' },
      { label: '黑体', value: 'SimHei' },
      { label: 'Arial', value: 'arial' },
      { label: 'Courier New', value: 'courier new' },
      { label: 'Helvetica', value: 'helvetica' },
      { label: 'sans-serif', value: 'sans-serif' },
    ]

    const Select = control.require('select');
    this.select = new Select(toolbar.el, this.options);
    this.select.setCustomClass('rd_select-ft-btn');
    this.select.setValue('字体');
    this.select.on('itemClick', this.onClick.bind(this));

    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(item){
    // this.editor.restoreSelection();
    // document.execCommand('fontName', false, item.value);
    this.editor.execCommand('fontName', false, item.value);
  }

  onRangeChange() {
    var values = this.options.map(item => item.value);
    const size = this.editor.match({
      type: 'tagNameAttribute',
      tagName: 'FONT',
      attribute: 'face',
      value: values
    })
    if (size) {
      const item = this.options.find(it => it.value === size);
      this.select.setValue(item.label);
    } else {
      this.select.setValue('字体');
    }
  }
}

export default FontName;