/**
 * 弹窗基类
 */

import Emitter from '../core/emitter';
import svgs from '../core/svgs';

interface DialogOptions {
  title?: string;
}

class Dialog extends Emitter {
  public el: HTMLElement;
  public header: HTMLElement;
  public content: HTMLElement;
  public footer: HTMLElement;
  public confirmBtn: HTMLElement;
  public cancelBtn: HTMLElement;
  public options: DialogOptions;
  public visible: boolean = false;

  constructor(options: DialogOptions) {
    super();

    this.options = Object.assign({}, options);

    this.createSkeleton();
    this.createHeader();
    this.createFooter();
  }

  public createSkeleton() {
    this.el = document.createElement('div');
    this.el.className = 'rd_dialog';
    this.el.style.display = 'none';

    this.header = document.createElement('div');
    this.header.className = 'rd_dialog-header';
    this.el.appendChild(this.header);

    this.content = document.createElement('div');
    this.content.className = 'rd_dialog-content';
    this.el.appendChild(this.content);

    this.footer = document.createElement('div');
    this.footer.className = 'rd_dialog-footer';
    this.el.appendChild(this.footer);

    document.body.addEventListener('click', (e: MouseEvent) => {
      if (!this.el.contains(<HTMLElement>e.target)) this.close();
    })
  }

  public createHeader() {
    const title = document.createElement('p');
    title.className = 'rd_dialog-title';
    title.textContent = this.options.title;
    this.header.appendChild(title);

    const close = document.createElement('button');
    close.className = 'rd_dialog-close';
    close.innerHTML = svgs.close;

    close.addEventListener('click', (e: MouseEvent) => this.close());
  }

  public createFooter() {
    this.confirmBtn = document.createElement('button');
    this.confirmBtn.className = 'rd_dialog-confirm-btn';
    this.footer.appendChild(this.confirmBtn);

    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'rd_dialog-cancel-btn';
    this.footer.appendChild(this.cancelBtn);

    this.cancelBtn.addEventListener('click', (e: MouseEvent) => this.close());
  }

  public close() {
    this.el.style.display = 'none';
    this.visible = false;
  }

  public open() {
    this.el.style.display = 'block';
    this.visible = true;
  }
}

export default Dialog;