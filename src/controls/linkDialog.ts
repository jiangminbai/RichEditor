/**
 * 链接弹窗
 */

import Dialog from './dialog';

interface DialogOptions {
  title?: string;
}

class LinkDialog extends Dialog {
  href: HTMLInputElement;
  text: HTMLInputElement;
  title: HTMLInputElement;

  constructor(element:HTMLElement, options: DialogOptions) {
    super(element, options);

    this.createContent();
    this.confirmBtn.addEventListener('click', (e: MouseEvent) => {
      this.fire('confirm', this.href.value, this.text.value, this.title.value);
      this.close();
    })
  }

  public createContent() {
    const content =
    `
    <div class="rd_form-group">
      <input class="rd_form-input rd_form-href" placeholder="链接地址" />
    </div>
    <div class="rd_form-group">
      <input class="rd_form-input rd_form-text" placeholder="显示文字" />
    </div>
    <div class="rd_form-group">
      <input class="rd_form-input rd_form-title" placeholder="标题" />
    </div>
    `
    this.content.innerHTML = content;
    this.href = this.content.querySelector('.rd_form-href');
    this.text = this.content.querySelector('.rd_form-text');
    this.title = this.content.querySelector('.rd_form-title');
  }

  public setValue(href: string, text: string, title) {
    this.href.value = href;
    this.text.value = text;
    this.title.value = title;
  }
}

export default LinkDialog;