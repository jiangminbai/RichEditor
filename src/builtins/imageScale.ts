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
    this.shadowImage.className = 'rd_shadow-image';
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
    let ratio = 1;
    let imageRect;
    let imageBoundingRect;
    let tag;
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, right, bottom, width, height } = imageRect;
      const {leftc, topc, rightc, bottomc} = imageBoundingRect;

      let xratio;
      let yratio;
      if (tag === 'rb') {
        xratio = (e.clientX - leftc) / width;
        yratio = (e.clientY - topc) / height;
      }

      if (tag === 'lt') {
        xratio = (rightc - e.clientX) / width;
        yratio = (bottomc - e.clientY) / height;
      }

      if (tag === 'lb') {
        xratio = (rightc - e.clientX) / width;
        yratio = (e.clientY - topc) / height;
      }

      if (tag === 'rt') {
        xratio = (e.clientX - leftc ) / width;
        yratio = (bottomc - e.clientY) / height;
      }
      
      ratio = Math.min(xratio, yratio);

      finalWidth = width * ratio;
      finalHeight = height * ratio;

      if (finalHeight > 20 && finalWidth > 20) {
        this.shadowImage.style.transform = 'scale(' + ratio + ')';
      }
    }
    this.rb.addEventListener('mousedown', () => {
      this.shadowImage.src = this.image.src;
      this.editor.el.appendChild(this.shadowImage);

      imageRect = this.getImageRect();
      imageBoundingRect = this.getImageBoundingRect();
      this.shadowImage.style.width = imageRect.width + 'px';
      this.shadowImage.style.height = imageRect.height + 'px';
      this.shadowImage.style.left = imageRect.left + 'px';
      this.shadowImage.style.top = imageRect.top + 'px';
      this.shadowImage.style.transformOrigin = 'left top';
      
      tag = 'rb';
      document.body.addEventListener('mousemove', handleMouseMove);
    })

    this.lt.addEventListener('mousedown', () => {
      this.shadowImage.src = this.image.src;
      this.editor.el.appendChild(this.shadowImage);

      imageRect = this.getImageRect();
      imageBoundingRect = this.getImageBoundingRect();
      this.shadowImage.style.width = imageRect.width + 'px';
      this.shadowImage.style.height = imageRect.height + 'px';
      this.shadowImage.style.left = imageRect.left + 'px';
      this.shadowImage.style.top = imageRect.top + 'px';
      this.shadowImage.style.transformOrigin = 'right bottom';
      
      tag = 'lt';
      document.body.addEventListener('mousemove', handleMouseMove);
    })

    this.lb.addEventListener('mousedown', () => {
      this.shadowImage.src = this.image.src;
      this.editor.el.appendChild(this.shadowImage);

      imageRect = this.getImageRect();
      imageBoundingRect = this.getImageBoundingRect();
      this.shadowImage.style.width = imageRect.width + 'px';
      this.shadowImage.style.height = imageRect.height + 'px';
      this.shadowImage.style.left = imageRect.left + 'px';
      this.shadowImage.style.top = imageRect.top + 'px';
      this.shadowImage.style.transformOrigin = 'right top';
      
      tag = 'lb';
      document.body.addEventListener('mousemove', handleMouseMove);
    })

    this.rt.addEventListener('mousedown', () => {
      this.shadowImage.src = this.image.src;
      this.editor.el.appendChild(this.shadowImage);

      imageRect = this.getImageRect();
      imageBoundingRect = this.getImageBoundingRect();
      this.shadowImage.style.width = imageRect.width + 'px';
      this.shadowImage.style.height = imageRect.height + 'px';
      this.shadowImage.style.left = imageRect.left + 'px';
      this.shadowImage.style.top = imageRect.top + 'px';
      this.shadowImage.style.transformOrigin = 'left bottom';
      
      tag = 'rt';
      document.body.addEventListener('mousemove', handleMouseMove);
    })

    document.body.addEventListener('mouseup', () => {
      if (this.editor.el.contains(this.shadowImage)) {
        this.shadowImage.removeAttribute('style');
        this.editor.el.removeChild(this.shadowImage);
      }
      
      if (finalWidth && finalHeight && this.image) {
        this.image.style.width = finalWidth + 'px';
        this.image.style.height = finalHeight + 'px';
      }
      document.body.removeEventListener('mousemove', handleMouseMove);
    })
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

  private getImageBoundingRect() {
    const { left, top, right, bottom} = this.image.getBoundingClientRect();
    return {
      leftc: left,
      topc: top,
      rightc: right,
      bottomc: bottom
    }
  }

  private onClickImage(e: MouseEvent) {
    const img = <HTMLImageElement>e.target;
    if (this.editor.el.contains(img) && img.tagName === 'IMG' && img !== this.shadowImage) {
      this.selectImage(img);
    } else {
      this.unselectImage();
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