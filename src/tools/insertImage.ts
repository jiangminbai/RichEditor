/**
 * 插入图片插件
 */

import Button from '../controls/button';
import ImageDialog from '../controls/imageDialog';
import Editor from '../core/editor';
import RichEditor from '../core/richEditor';

class InsertImage {
  button: Button;
  imageDialog: ImageDialog;
  editor: Editor;

  install (context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.image);
    this.button.on('click', (e: MouseEvent) => this.onClick(e));

    const ImageDialog = control.require('imageDialog');
    this.imageDialog = new ImageDialog(this.button.el, {
      title: '编辑图片'
    });
    this.imageDialog.on('confirm', (url: string, alt: string) => this.insertUrl(url, alt));
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(e: MouseEvent) {
    if (this.imageDialog.visible) return this.imageDialog.close();
    this.imageDialog.open();
  }

  insertUrl(url: string, alt: string) {
    this.editor.execCommand('insertImage', false, url, alt);
  }

  onRangeChange() {
    // const nodeChain = this.editor.getNodeChain();
    // const node = nodeChain.find(node => node.tagName === 'A');
    // if (!node) return this.imageDialog.setValue('', '');
    // const href = node.getAttribute('href');
    // const text = node.textContent;
    // const title = node.getAttribute('title');
    // this.imageDialog.setValue(href, text);
  }
}

export default InsertImage;