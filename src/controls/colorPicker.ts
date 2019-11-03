/**
 * 颜色拾取器
 * 领域知识：三种色彩模式
 * 1.RGB：通过组合红色(red)、绿色(green)、蓝色(blue)三种颜色通道的变化来表示颜色。取值范围0-255|0%-100%
 * 2.HEX：和RGB相同，不同的是取值范围00-FF
 * 3.HSL: 通过色相(hub)、饱和度(saturation)、明度(lightness)三种颜色通道的变化来表示变化。取值范围H(0-360)S(0-100%)L(0-100%)
 * 色相：颜色的值，0(或360)表示红色，120表示绿色，240表示蓝色
 * 饱和度：和掺入白色的量相关，掺入越少，越饱和。0 (透明)-100% (完全饱和)
 * 明度：和掺入黑色的量相关，掺入越少，越明亮。
 */
interface PaletteOptions{
  width: string,
  height: string
}

// 坐标
interface Point {
  x: number,
  y: number
}

import Emitter from '../core/emitter';

// rgb字符串转化为对象
function parseRGB(rgb: string) {
  const rgbO: any = {};
  const rgbA = rgb.match(/[0-9\.]+/g);
  rgbO.r = rgbA[0];
  rgbO.g = rgbA[1];
  rgbO.b = rgbA[2];
  rgbO.a = rgbA[3] || 1;
  return rgbO;
}

// 调色板
class Palette {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(container: HTMLElement, options: PaletteOptions) {
    this.width = parseInt(options.width);
    this.height = parseInt(options.height);
    this.createElement(container, options);
    this.render();
    this.listenMouse();
  }

  // 创建基本元素
  private createElement(container: HTMLElement, options: PaletteOptions) {
    this.el = document.createElement('div');
    this.el.className = 'rd_color-palette';
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = options.width;
    this.canvas.style.height = options.height;
    this.canvas.setAttribute('width', options.width);
    this.canvas.setAttribute('height', options.height);
    this.canvasCtx = this.canvas.getContext('2d');
    this.el.appendChild(this.canvas);
    container.appendChild(this.el);
  }

  // 渲染
  render(x: number = this.width, y: number = 0, hub?: string) {
    this.drawPalette(hub);
    this.drawPicker(x, y);
  }

  /**
   * 绘制调色板
   * const rtRGB = 'rgb(255, 0, 0)'; // 右上角颜色（默认）
   * const lrRGB = 'rgb(255, 255, 255)'; // 左上角颜色
   * const lbRGB = 'rgb(0, 0, 0)'; // 左下角颜色
   * const rbRGB = 'rgb(0, 0, 0)'; // 右下角颜色
   */
  drawPalette(hub?: string) {
    const w = this.width;
    const h = this.height;

    const piece = 255; // 总共多少份
    const defaultRGB = hub || 'rgb(255, 0, 0)';
    const { r, g, b } = parseRGB(defaultRGB);

    for (let i = 0; i < piece + 1; i++) {
      const xrgb = `rgb(${255 - (255 - r) * i / 255}, ${255 - (255 - g) * i / 255}, ${ 255 - (255 - b) * i / 255})`;
      const x = w * i / 255;
      const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, xrgb);
      gradient.addColorStop(1, '#000');
      this.canvasCtx.beginPath();
      this.canvasCtx.fillStyle = gradient;
      this.canvasCtx.rect(x,0,x,h);
      this.canvasCtx.fill();
    }
  }

  // 绘制调色板拾取器
  drawPicker(x: number, y: number) {
    this.canvasCtx.beginPath();
    this.canvasCtx.shadowColor = 'rgba(255,0,0,0.2)';
    this.canvasCtx.shadowOffsetX = 1;
    this.canvasCtx.shadowOffsetY = 1;
    this.canvasCtx.strokeStyle = '#fff';
    this.canvasCtx.arc(x, y, 6, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
  }

  listenMouse() {
    const mouseMove = (e) => {
      this.onMouseDM(e.layerX, e.layerY);
    }
    this.canvas.addEventListener('mousedown', (e) => {
      this.onMouseDM(e.offsetX, e.offsetY);
      this.canvas.addEventListener('mousemove', mouseMove);
    });
    this.canvas.addEventListener('mouseup', () => {
      this.canvas.removeEventListener('mousemove', mouseMove);
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.canvas.removeEventListener('mousemove', mouseMove);
    })
  }

  onMouseDM(x: number, y: number) {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    this.render(x, y);
  }
}

// 色相
class Hub {
  el: HTMLElement;
  bar: HTMLElement;
  btn: HTMLElement;

  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'rd_hub';
    this.bar = document.createElement('div');
    this.bar.className = 'rd_hub-bar';
    this.btn = document.createElement('div');
    this.btn.className = 'rd_hub-btn';
    container.appendChild(this.el);
    this.el.appendChild(this.bar);
    this.bar.appendChild(this.btn);
  }
}

// RGB
class RGBControl {
  el: HTMLElement;
  inputList: HTMLElement;
  rinput: HTMLElement;
  ginput: HTMLElement;
  binput: HTMLElement;
  labelList: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'rd_rgb-control';

    const html = 
    `
    <div class="rd_rgb-control-list">
      <div class="rd_rgb-input">
        <input type="text" />
        <div class="rd_rgb-control-label">R</div>
      </div>
      <div class="rd_rgb-input">
        <input type="text" />
        <div class="rd_rgb-control-label">G</div>
      </div>
      <div class="rd_rgb-input">
        <input type="text" />
        <div class="rd_rgb-control-label">B</div>
      </div>
    </div>
    `
    this.el.innerHTML = html;
    container.appendChild(this.el);
  }
}

// 颜色显示器
class ColorDisplay {
  el: HTMLElement;

  constructor(container) {
    this.el = document.createElement('div');
    this.el.className = 'rd_color-display';
    container.appendChild(this.el);
  }

  setBg(rgb: string) {
    this.el.style.background = rgb;
  }
}

// 颜色拾取器
class ColorPicker extends Emitter {
  el: HTMLElement;
  palette: Palette;
  hub: Hub;
  box: HTMLElement;
  colorDisplay: ColorDisplay;
  rgbControl: RGBControl;

  constructor() {
    super();
    this.el = document.createElement('div');
    this.el.className = 'rd_color-picker';
    this.palette = new Palette(this.el, {width: '180px', height: '125px'});
    this.hub = new Hub(this.el);
    this.box = document.createElement('div');
    this.box.className = 'rd_box';
    this.colorDisplay = new ColorDisplay(this.box);
    this.rgbControl = new RGBControl(this.box);
    this.el.appendChild(this.box);

    // this.test()
  }

  open(e: MouseEvent) {
    const rect = (<HTMLElement>e.target).getBoundingClientRect();
    this.el.style.top = rect.bottom + 'px';
    this.el.style.left = rect.left + 'px';
    document.body.appendChild(this.el);
  }

  test() {
    document.body.appendChild(this.el);
  }
}

export default ColorPicker;

