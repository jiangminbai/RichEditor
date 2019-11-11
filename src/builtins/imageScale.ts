/**
 * 内置图片缩放功能
 */

import Emitter from '../core/emitter';
import Editor from '../core/editor';

class ImageScale {
  editor: Editor;
  image: HTMLImageElement = null; // 持有当前img对象
  shadowImage: HTMLImageElement = null; // 透明img对象
  lt: HTMLElement; // 左上点
  lb: HTMLElement; // 左下点
  rt: HTMLElement; // 右上点
  rb: HTMLElement; // 右下点

  constructor(editor: Editor) {
    this.editor = editor;

    this.createDot();
    this.createShadowImage();
    this.handleDot();

    document.addEventListener('click', (e: MouseEvent) => this.onClickImage(e));
  }

  // 创建透明图片
  createShadowImage() {
    this.shadowImage = document.createElement('img');
    this.shadowImage.style.opacity = '0.5';
    this.shadowImage.style.position = 'absolute';
  }

  // 创建四个点
  private createDot() {
    this.lt = document.createElement('div');
    this.lt.className = 'rd_image-scale-dot lt';

    this.lb = document.createElement('div');
    this.lb.className = 'rd_image-scale-dot lb';

    this.rt = document.createElement('div');
    this.rt.className = 'rd_image-scale-dot rt';

    this.rb = document.createElement('div');
    this.rb.className = 'rd_image-scale-dot rb';
  }

  private handleDot() {
    let finalWidth;
    let finalHeight;
    const handleMouseMove = (e: MouseEvent) => {

      const { left, top, right, bottom, width, height } = this.getImageRect();
      const {leftc, topc, rightc, bottomc} = this.getImageBoundingRect();

      const xratio = (e.clientX - leftc) / width;
      const yratio = (e.clientY - topc) / height;

      
      const ratio = Math.min(xratio, yratio);
      console.log(xratio, yratio, ratio);

      finalWidth = ratio > 0 ? width * ratio : 20;
      finalHeight = ratio > 0 ? height * ratio : 20;
      
      this.shadowImage.style.width = width * ratio + 'px';
      this.shadowImage.style.height = height * ratio + 'px';
    }
    this.rb.addEventListener('mousedown', () => {
      this.shadowImage.src = this.image.src;
      this.shadowImage.style.left = this.getImageRect().left + 'px';
      this.shadowImage.style.top = this.getImageRect().top + 'px';
      this.editor.el.appendChild(this.shadowImage);
      document.body.addEventListener('mousemove', handleMouseMove);
    })

    document.body.addEventListener('mouseup', () => {
      if (this.editor.el.contains(this.shadowImage)) this.editor.el.removeChild(this.shadowImage);
      if (finalWidth && finalHeight && this.image) {
        this.image.style.width = finalWidth + 'px';
        this.image.style.height = finalHeight + 'px';
      }
      document.body.removeEventListener('mousemove', handleMouseMove);
    })
  }

  private onClickImage(e: MouseEvent) {
    const img = <HTMLImageElement>e.target;
    if (this.editor.el.contains(img) && img.tagName === 'IMG') {
      this.selectImage(img);
    } else {
      this.unselectImage();
    }
  }

  // 获取image四个顶点的坐标位置
  private getImageRect() {
    const offsetTop = this.image.offsetTop;
    const offsetLeft = this.image.offsetLeft;
    const offsetWidth = this.image.offsetWidth;
    const offsetHeight= this.image.offsetHeight;

    return {
      top: offsetTop,
      left: offsetLeft,
      right: offsetLeft + offsetWidth,
      bottom: offsetTop + offsetHeight,
      width: offsetWidth,
      height: offsetHeight
    }
  }

  getImageBoundingRect() {
    const { left, top, right, bottom} = this.image.getBoundingClientRect();
    return {
      leftc: left,
      topc: top,
      rightc: right,
      bottomc: bottom
    }
  }

  public selectImage(img: HTMLImageElement) {
    if (this.image) {
      this.image.removeAttribute('data-rd-selected');
    }

    this.image = img;
    this.image.setAttribute('data-rd-selected', "1");
    this.editor.range.selectNode(this.image);

    const {left, right, top, bottom} = this.getImageRect();

    this.editor.el.appendChild(this.lt);
    this.lt.style.left = (left - this.lt.offsetWidth/2) + 'px';
    this.lt.style.top = (top - this.lt.offsetHeight/2) + 'px';

    this.editor.el.appendChild(this.lb);
    this.lb.style.left = (left - this.lb.offsetWidth/2) + 'px';
    this.lb.style.top = (bottom - this.lb.offsetHeight/2) + 'px';

    this.editor.el.appendChild(this.rt);
    this.rt.style.left = (right - this.rt.offsetWidth/2) + 'px';
    this.rt.style.top = (top - this.rt.offsetHeight/2) + 'px';

    this.editor.el.appendChild(this.rb);
    this.rb.style.left = (right - this.rb.offsetWidth/2) + 'px';
    this.rb.style.top = (bottom - this.rb.offsetHeight/2) + 'px';
  }

  private unselectImage() {
    if (this.image) {
      this.image.removeAttribute('data-rd-selected');
      this.image = null;
      this.editor.el.removeChild(this.lt);
      this.editor.el.removeChild(this.lb);
      this.editor.el.removeChild(this.rt);
      this.editor.el.removeChild(this.rb);
    }
  }
}

export default ImageScale;