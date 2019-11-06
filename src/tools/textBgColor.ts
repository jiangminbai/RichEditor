/**
 * 文字背景颜色
 */
import RichEditor from '../core/richEditor';
import Editor from '../core/editor';
import ColorButton from '../controls/colorButton';
import ColorPicker from '../controls/colorPicker';


class TextBgColor {
  editor: Editor;
  colorButton: ColorButton;
  colorPicker: ColorPicker;

  install(context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const ColorButton = control.require('colorButton');
    this.colorButton = new ColorButton(toolbar.el);
    this.colorButton.setIcon(svgs["highlight-bg-color"]);

    const ColorPicker = control.require('colorPicker');
    this.colorPicker = new ColorPicker(this.colorButton.el);
   

    this.colorButton.on('click', e => this.onClick(e));
    this.colorPicker.on('change', color => this.onPickerChange(color));
    editor.on('rangechange', () => this.onRangeChange());
  }

  onClick(e){
    if (!this.colorPicker.visible)
      this.colorPicker.show(this.colorButton.getColor());
    else
      this.colorPicker.hide();
  }

  onPickerChange(rgb: string) {
    this.colorButton.setColor(rgb);
    this.editor.execCommand('hiliteColor',false, rgb);
  }

  onRangeChange() {
    const color = this.editor.match({
      type: 'style',
      styleName: 'backgroundColor'
    })
    if (color) {
      this.colorButton.setColor(color);
    } else {
      this.colorButton.setColor('rgb(0, 0, 0)');
    }
  }
}

export default TextBgColor;