/**
 * 图片弹窗
 */

import Dialog from './dialog';
import Tab from './tab';
import UploadImage from './uploadImage';

interface DialogOptions {
  title?: string;
}

class ImageDialog extends Dialog {
  tab: Tab;
  netImageContent: HTMLElement;
  localImageContent: HTMLElement;
  url: HTMLInputElement;
  alt: HTMLInputElement;

  constructor(element:HTMLElement, options: DialogOptions) {
    super(element, options);

    this.tab = new Tab(this.content);
    this.createNetImageContent();
    this.tab.appendChild({title: '网络图片', content: this.netImageContent});
    this.createLocalImageContent();
    this.tab.appendChild({title: '本地图片', content: this.localImageContent});

    this.confirmBtn.addEventListener('click', (e: MouseEvent) => {
      this.fire('confirm', this.url.value, this.alt.value);
      this.close();
    })
  }

  public createNetImageContent() {
    this.netImageContent = document.createElement('div');
    this.netImageContent.className = 'rd_imagedialog-net';
    const form =
    `
    <div class="rd_form-group">
      <input class="rd_form-input rd_form-url" placeholder="链接地址" />
    </div>
    <div class="rd_form-group">
      <input class="rd_form-input rd_form-alt" placeholder="图片描述" />
    </div>
    `
    this.netImageContent.innerHTML = form;
    this.url = this.netImageContent.querySelector('.rd_form-url');
    this.alt = this.netImageContent.querySelector('.rd_form-alt');
  }

  public createLocalImageContent() {
    this.localImageContent = document.createElement('div');
    this.localImageContent.className = 'rd_imagedialog-local';
    const uploadImage = new UploadImage(this.localImageContent);
  }

  public setValue(href: string, text: string, title) {
    // this.href.value = href;
    // this.text.value = text;
    // this.title.value = title;
  }
}

export default ImageDialog;