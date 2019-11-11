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
  private triggerEl: HTMLElement;
  public header: HTMLElement;
  public content: HTMLElement;
  public footer: HTMLElement;
  public confirmBtn: HTMLElement;
  public cancelBtn: HTMLElement;
  public options: DialogOptions;
  public visible: boolean = false;

  constructor(element:HTMLElement, options: DialogOptions) {
    super();

    this.triggerEl = element;
    this.options = Object.assign({}, options);

    this.createSkeleton(element);
    this.createHeader();
    this.createFooter();

    document.body.appendChild(this.el);
  }

  private createSkeleton(element: HTMLElement) {
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
      if (!this.el.contains(<HTMLElement>e.target) && this.el !== e.target && !element.contains(<HTMLElement>e.target) && element !== e.target) {
        this.close();
      }
    })
  }

  private createHeader() {
    const title = document.createElement('p');
    title.className = 'rd_dialog-title';
    title.textContent = this.options.title;
    this.header.appendChild(title);

    const close = document.createElement('button');
    close.className = 'rd_dialog-close';
    close.innerHTML = svgs.close;
    this.header.appendChild(close);

    close.addEventListener('click', (e: MouseEvent) => this.close());
  }

  private createFooter() {
    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'rd_dialog-cancel-btn';
    this.cancelBtn.textContent = '取消';
    this.footer.appendChild(this.cancelBtn);

    this.confirmBtn = document.createElement('button');
    this.confirmBtn.className = 'rd_dialog-confirm-btn';
    this.confirmBtn.textContent = '确认';
    this.footer.appendChild(this.confirmBtn);

    this.cancelBtn.addEventListener('click', (e: MouseEvent) => this.close());
  }

  // 计算位置
  private calcPos() {
    const bounding = this.triggerEl.getBoundingClientRect();
    const elWidth = this.el.clientWidth;
    const elHeight = this.el.clientHeight;
    const bodyWidth = document.body.clientWidth;

    let left = bounding.left;
    let top = bounding.bottom;
    if ((elWidth + bounding.left) > bodyWidth) {
      left = bodyWidth - elWidth;
    }

    this.el.style.left = left + 'px';
    this.el.style.top = top + 'px';
  }

  public close() {
    this.el.style.display = 'none';
    this.visible = false;
  }

  public open() {
    this.el.style.display = 'block';
    this.visible = true;
    this.calcPos();
  }

  
}

export default Dialog;