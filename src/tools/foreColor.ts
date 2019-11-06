/**
 * 文字颜色
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import ColorButton from '../controls/colorButton';
import ColorPicker from '../controls/colorPicker';


class ForeColor {
  editor: Editor;
  colorButton: ColorButton;
  colorPicker: ColorPicker;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const ColorButton = control.require('colorButton');
    this.colorButton = new ColorButton(toolbar.el);
    this.colorButton.setIcon(svgs["text-color"]);

    const ColorPicker = control.require('colorPicker');
    this.colorPicker = new ColorPicker(this.colorButton.el);
   

    this.colorButton.on('click', e => this.onClick(e));
    this.colorPicker.on('change', color => this.onPickerChange(color));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(e){
    this.colorPicker.show(this.colorButton.getColor());
    // this.editor.restoreSelection();
    // document.execCommand('bold');
  }

  onPickerChange(rgb: string) {
    console.log(rgb);
    this.colorButton.setColor(rgb);
    this.editor.restoreSelection();
    document.execCommand('foreColor',false, rgb);
  }

  onRangeChange() {
    // const isMatch = this.editor.match({
    //   type: 'tagName',
    //   value: 'B'
    // })
    // isMatch ? this.colo.setActive() : this.button.resetActive();
  }
}

export default ForeColor;