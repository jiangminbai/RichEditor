/**
 * 链接插件
 */
import Button from '../controls/button';
import LinkDialog from '../controls/linkDialog';
import Editor from '../core/editor';
import RichEditor from '../core/richEditor';

class Link {
  button: Button;
  linkDialog: LinkDialog;
  editor: Editor;

  install (context: RichEditor) {
    const { editor, svgs, toolbar, control } = context;
    this.editor = editor;

    const Button = control.require('button');
    this.button = new Button(toolbar.el);
    this.button.setIcon(svgs.link);
    this.button.on('click', (e: MouseEvent) => this.onClick(e));

    const LinkDialog = control.require('linkDialog');
    this.linkDialog = new LinkDialog(this.button.el, {
      title: '链接'
    });
    this.linkDialog.on('confirm', (href, text, title) => this.insertHref(href, text, title));
    
    editor.on('rangechange', this.onRangeChange.bind(this));
  }

  onClick(e: MouseEvent) {
    if (this.linkDialog.visible) return this.linkDialog.close();
    this.linkDialog.open();
  }

  insertHref(href: string, text: string, title: string) {
    this.editor.execCommand('link', false, href, text, title);
  }

  onRangeChange() {

  }
}

export default Link;