/**
 * 上传图片
 */

import Emitter from '../core/emitter';

class UploadImage extends Emitter {
  el: HTMLElement;
  uploadBtn: HTMLElement;
  fileElem: HTMLInputElement;

  constructor(container: HTMLElement) {
    super();

    this.createElement(container);
    this.uploadBtn.addEventListener('click', (e: MouseEvent) => this.upload(e));
    this.fileElem.addEventListener('change', (e: MouseEvent) => this.onFileChange(e));
    this.el.addEventListener('dragenter', (e: DragEvent) => this.onDragEnter(e));
    this.el.addEventListener('dragleave', (e: DragEvent) => this.onDragLeave(e));
    this.el.addEventListener('dragover', (e: DragEvent) => this.onDragOver(e));
    this.el.addEventListener('drop', (e: DragEvent) => this.onDrop(e));
  }

  private createElement(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'rd_upload-image';
    
    const desc = document.createElement('div');
    desc.className = 'rd_upload-image-desc';
    desc.textContent = '拖拽一张图片至此';
    this.el.appendChild(desc);

    this.uploadBtn = document.createElement('button');
    this.uploadBtn.className = 'rd_upload-button';
    this.uploadBtn.innerHTML = '上传图片<input type="file" accept="image/*" style="display:none">';
    this.fileElem = this.uploadBtn.querySelector('input');
    this.el.appendChild(this.uploadBtn);

    container.appendChild(this.el);
  }

  private upload(e: MouseEvent) {
    this.fileElem.click();
  }

  private onFileChange(e: MouseEvent) {
    const file = this.fileElem.files[0];
    this.handleFile(file);
  }

  private onDragEnter(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  private onDragOver(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLElement>e.target;
    if (target === this.el || this.el.contains(target)) this.el.classList.add('active');
  }

  private onDragLeave(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLElement>e.target;
    if (target === this.el) this.el.classList.remove('active');
  }

  private onDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();

    const target = <HTMLElement>e.target;
    if (target === this.el) this.el.classList.remove('active');

    const file = e.dataTransfer.files[0];
    this.handleFile(file);
    
  }

  private handleFile(file: File) {
    const render = new FileReader();
    render.onload = (e) => {
      this.fire('change', <string>e.target.result);
      console.log(e.target.result);
    }
    render.readAsDataURL(file);
  }
}

export default UploadImage;