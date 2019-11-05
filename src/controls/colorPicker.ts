/**
 * 颜色拾取器
 * 领域知识：三种色彩模式
 * 1.RGB：通过组合红色(red)、绿色(green)、蓝色(blue)三种颜色通道的变化来表示颜色。取值范围0-255|0%-100%
 * 2.HEX：和RGB相同，不同的是取值范围00-FF
 * 3.HSV：通过色相(hub)、饱和度(saturation)、明度(lightness)三种颜色通道的变化来表示变化。
 * H [0-360] S [0-1] V [0-1]
 * 色相：在不同波长的光照射下，人眼所感觉不同的颜色。它是一个分段函数。通过三原色可以演变出形成6色环、12色环、24色环的色相环或色相条。
 * 原色之间是线性变化的。
 * 饱和度：和掺入白色的量相关，掺入越少，越饱和。反映在调色板上从左白色到右纯色线性变化。
 * 明度：和掺入黑色的量相关，掺入越少，越明亮。反映在调色板上从下黑色到上白色线性变化。
 * 4.HSL: 通过色相(hub)、饱和度(saturation)、明度(lightness)三种颜色通道的变化来表示变化。
 * H和HSV是一个意思，SL不是一个意思
 * H [0-360] S [0-1] L [0-1]
 */

import {
  nonNumber
} from '../util/util';

 // 调色板构造函数参数
interface PaletteOptions{
  width: string,
  height: string,
  x?: number,
  y?: number,
  h?: number
}

import Emitter from '../core/emitter';

// rgb to object
function rgb2object(rgb: string) {
  const rgbO: any = {};
  const rgbA = rgb.match(/[0-9\.]+/g);
  rgbO.value = rgb;
  rgbO.r = Number(rgbA[0]);
  rgbO.g = Number(rgbA[1]);
  rgbO.b = Number(rgbA[2]);
  rgbO.a = Number(rgbA[3] || 1);
  return rgbO;
}

// rgb to hsv
function rgb2hsv(r: number, g: number, b: number) {
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return { h, s, v, r, g, b};
}

// hsv to rgb
function hsv2rgb(h: number, s: number, v: number) {
  h = h * 6;
  var i = Math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
      var value = `rgb(${r}, ${g}, ${b})`;

  return { value, r, g, b, h: h / 6, s, v };
}

// 调色板
class Palette extends Emitter {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  width: number; // 画布宽度
  height: number; // 画布高度
  x: number; // 选择器的x坐标
  y: number; // 选择器y坐标
  h: number; // 色相

  constructor(container: HTMLElement, options: PaletteOptions) {
    super();
    this.width = parseInt(options.width);
    this.height = parseInt(options.height);
    this.x = options.x || this.width; // 默认值
    this.y = options.y || 0; // 默认值
    this.h = options.h || 0; // 默认值

    this.createElement(container);
    this.render();
    this.listenMouse();
  }

  // 创建基本元素
  private createElement(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'rd_color-palette';

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.setAttribute('width', this.width + 'px');
    this.canvas.setAttribute('height', this.height + 'px');
    this.canvasCtx = this.canvas.getContext('2d');

    this.el.appendChild(this.canvas);
    container.appendChild(this.el);
  }

  // 渲染
  private render() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);

    this.drawPalette();
    this.drawPicker();
  }

  /**
   * 绘制调色板 HSV
   */
  private drawPalette() {
    const rgb = hsv2rgb(this.h, 1, 1).value;
    
    this.canvasCtx.fillStyle = rgb;
    this.canvasCtx.fillRect(0, 0, this.width, this.height)

    this.createLinearGradient(0, 0, this.width,0, '#fff', 'rgba(255,255,255,0)');
    this.createLinearGradient( 0, 0, 0, this.height, 'rgba(255,255,255,0)', 'rgba(0,0,0)');
  }

  private createLinearGradient(x1: number, y1: number, x2: number, y2: number, startColor: string, endColor: string) {
    const gradient = this.canvasCtx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = gradient;
    this.canvasCtx.rect(0, 0, this.width, this.height);
    this.canvasCtx.fill();
  }

  // 绘制调色板选择器
  private drawPicker() {
    this.canvasCtx.beginPath();

    this.canvasCtx.shadowColor = 'rgba(255,0,0,0.2)';
    this.canvasCtx.shadowOffsetX = 1;
    this.canvasCtx.shadowOffsetY = 1;
    this.canvasCtx.strokeStyle = '#fff';

    this.canvasCtx.arc(this.x, this.y, 6, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
  }

  private listenMouse() {
    const onMouseMove = e => {
      this.onMouseDown(e);
    }

    this.canvas.addEventListener('mousedown', e => {
      this.onMouseDown(e);
      document.addEventListener('mousemove', onMouseMove);
    })

    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', onMouseMove);
    })

    document.addEventListener('mouseleave', e => {
      document.removeEventListener('mousemove', onMouseMove);
    })
  }

  // 坐标转换为sv
  xy2sv() {
    return {
      s: this.x / this.width,
      v: (this.height - this.y) / this.height
    }
  }

  // 获取选择器选中的颜色
  private getColor() {
    const { s, v } = this.xy2sv();

    return hsv2rgb(this.h, s, v);
  }

  onMouseDown(e) {
    // 鼠标点击的坐标
    const x = e.clientX;
    const y = e.clientY;

    const { top, bottom, left, right, width, height } = this.canvas.getBoundingClientRect();

    if (x > right)
      this.x = width
    else if (x < left)
      this.x = 0
    else
      this.x = x - left

    if (y > bottom)
      this.y = height
    else if (y < top)
      this.y = 0
    else
      this.y = y - top

    this.render();
    this.fire('sv-change', this.getColor());
  }

  public updateHub(hub) {
    this.h = hub;
    this.render();
    this.fire('h-change', this.getColor());
  }

  public updateRGB(r: number, g: number, b: number) {
    const { h, s, v } = rgb2hsv(r, g, b);
    this.h = h;
    this.x = s * this.width;
    this.y = (1 - v) * this.height;

    this.render();
    this.fire('hsv-change', this.getColor());
  }
}

// 色相
class Hub extends Emitter {
  el: HTMLElement;
  bar: HTMLElement;
  btn: HTMLElement;
  right: number = 0; // 滑动按钮距离滑动条右侧的距离

  constructor(container: HTMLElement) {
    super();
    this.createElement(container);
    this.dragBtn();
  }

  private createElement(container: HTMLElement) {
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

  private dragBtn() {
    const onMouseMove = e => {
      this.onMousemoveBtn(e);
    }
    this.bar.addEventListener('mousedown', e => {
      this.onMouseDownBar(e);
    });
    this.btn.addEventListener('mousedown', e => {
      document.addEventListener('mousemove', onMouseMove)
    })
    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', onMouseMove);
    })
    document.addEventListener('mouseleave', e => {
      document.removeEventListener('mousemove', onMouseMove);
    })
  }

  private onMouseDownBar(e) {
    if (e.target == this.bar) {
      const barWidth = this.bar.clientWidth;
      const offsetX = e.offsetX;
      this.btn.style.right = (barWidth - offsetX) + 'px';
      this.right = parseInt(this.btn.style.right);

      this.fire('change', this.getHub());
    }
  }

  private onMousemoveBtn(e: MouseEvent) {
    const barClientRect = this.bar.getBoundingClientRect();

    if (e.clientX < barClientRect.left) {
      this.btn.style.right = barClientRect.width + 'px';
    } else if (e.clientX > barClientRect.right) {
      this.btn.style.right = '0px';
    } else {
      this.btn.style.right = (barClientRect.right - e.clientX) + 'px';
    }

    this.right = parseInt(this.btn.style.right);
    this.fire('change', this.getHub());
  }

  // 计算色相条当前的hub值和转换的rgb值
  private getHub() {
    return this.right / this.bar.clientWidth;
  }

  public update(hub: number) {
    console.log(hub);
    this.right = this.bar.clientWidth * hub;
    this.btn.style.right = this.right + 'px';
  }
}

// RGB
class RGBControl extends Emitter {
  el: HTMLElement;
  inputList: HTMLElement;
  rinput: HTMLInputElement;
  ginput: HTMLInputElement;
  binput: HTMLInputElement;
  labelList: HTMLElement;

  constructor(container: HTMLElement) {
    super();
    this.createElement(container);
    this.listenDOM();
  }

  createElement(container) {
    this.el = document.createElement('div');
    this.el.className = 'rd_rgb-control';

    const html = 
    `
    <div class="rd_rgb-control-list">
      <div class="rd_rgb-input">
        <input type="text" class="rd_rgb-rinput" />
        <div class="rd_rgb-control-label">R</div>
      </div>
      <div class="rd_rgb-input">
        <input type="text" class="rd_rgb-ginput" />
        <div class="rd_rgb-control-label">G</div>
      </div>
      <div class="rd_rgb-input">
        <input type="text" class="rd_rgb-binput" />
        <div class="rd_rgb-control-label">B</div>
      </div>
    </div>
    `
    this.el.innerHTML = html;
    this.rinput = this.el.querySelector('.rd_rgb-rinput');
    this.ginput = this.el.querySelector('.rd_rgb-ginput');
    this.binput = this.el.querySelector('.rd_rgb-binput');

    this.rinput.value = '255';
    this.ginput.value = '0';
    this.binput.value = '0';

    container.appendChild(this.el);
  }

  listenDOM() {
    this.rinput.addEventListener('input', (e: MouseEvent) => this.OnInput(e));
    this.ginput.addEventListener('input', (e: MouseEvent) => this.OnInput(e));
    this.binput.addEventListener('input', (e: MouseEvent) => this.OnInput(e));
  }

  OnInput(e: MouseEvent) {
    if (this.checkValid([this.rinput, this.ginput, this.binput])) {
      const r = Number(this.rinput.value);
      const g = Number(this.ginput.value);
      const b = Number(this.binput.value);

      this.fire('change', {r, g, b});
    }
  }

  private checkValid(inputs: HTMLInputElement[]): boolean {
    for(let i = 0; i < inputs.length; i++) {
      let value: number | string = inputs[i].value;
      if (nonNumber.test(value)) return false;

      value = Number(value);
      if (value < 0 || value > 255) return false;
    }
    return true;
  }

  updateRGB(r: number, g: number, b: number) {
    this.rinput.value = String(r);
    this.ginput.value = String(g);
    this.binput.value = String(b);
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

  update(rgb: string) {
    this.el.style.background = rgb;
  }
}

// 颜色选择列表
class ColorSelect extends Emitter {
  el: HTMLElement;

  constructor(container) {
    super();
    this.createElement(container);
    this.el.addEventListener('click', e => this.onClick(e));
  }

  createElement(container) {
    this.el = document.createElement('div');
    this.el.className = 'rd_color-select';
    const colorList = this.getColor();
    colorList.forEach(item => {
      const span = document.createElement('span');
      span.className = 'rd_color-select-item';
      span.style.background = item;
      this.el.appendChild(span);
    })

    container.appendChild(this.el);
  }

  onClick(e: MouseEvent) {
    if ((<HTMLElement>e.target).classList.contains('rd_color-select-item')) {
      const bgColor = (<HTMLElement>e.target).style.backgroundColor;
      this.fire('change', rgb2object(bgColor));
    }
  }

  private getColor() {
    return [
      'rgb(244, 67, 54)',
      'rgb(233, 30, 99)',
      'rgb(156, 39, 176)',
      'rgb(103, 58, 183)',
      'rgb(63, 81, 181)',
      'rgb(33, 150, 243)',
      'rgb(0, 188, 212)',
      'rgb(0, 150, 136)',
      'rgb(76, 175, 80)',
      'rgb(139, 195, 74)',
      'rgb(205, 220, 57)',
      'rgb(255, 235, 59)',
      'rgb(255, 193, 7)',
      'rgb(255, 152, 0)',
      'rgb(255, 87, 34)',
      'rgb(255, 87, 34)',
      'rgb(158, 158, 158)',
      'rgb(0, 0, 0)'
    ]
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
  colorSelect: ColorSelect;

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

    this.colorSelect = new ColorSelect(this.el);

    this.hub.on('change', h => {
      this.palette.updateHub(h);
    })

    this.palette.on('hsv-change', color => {
      this.hub.update(color.h);
      this.colorDisplay.update(color.value);
      this.rgbControl.updateRGB(color.r, color.g, color.b);
    })

    this.palette.on('h-change', color => {
      this.colorDisplay.update(color.value);
      this.rgbControl.updateRGB(color.r, color.g, color.b);
    })

    this.palette.on('sv-change', color => {
      this.colorDisplay.update(color.value);
      this.rgbControl.updateRGB(color.r, color.g, color.b);
    })

    this.colorSelect.on('change', color => {
      this.palette.updateRGB(color.r, color.g, color.b);
    })

    this.rgbControl.on('change', color => {
      this.palette.updateRGB(color.r, color.g, color.b);
    })

    this.test()
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