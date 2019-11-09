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

  constructor(options: DialogOptions) {
    super(options);

    this.createContent();
    this.confirmBtn.addEventListener('click', (e: MouseEvent) => {
      this.fire('confirm', this.href.value, this.text.value, this.title.value);
    })
  }

  public createContent() {
    const content =
    `
    <div class="rd_form-group">
      <label class="rd_form-label">链接地址</label>
      <input class="rd_form-input rd_form-href" />
    </div>
    <div class="rd_form-group">
      <label class="rd_form-label">显示文字</label>
      <input class="rd_form-input rd_form-text" />
    </div>
    <div class="rd_form-group">
      <label class="rd_form-label">标题</label>
      <input class="rd_form-input rd_form-title" />
    </div>
    `
    this.content.innerHTML = content;
    this.href = this.content.querySelector('.rd_form-href');
    this.text = this.content.querySelector('.rd_form-text');
    this.title = this.content.querySelector('.rd_form-title');
  }
}