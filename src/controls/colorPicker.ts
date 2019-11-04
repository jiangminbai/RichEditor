/**
 * 颜色拾取器
 * 领域知识：三种色彩模式
 * 1.RGB：通过组合红色(red)、绿色(green)、蓝色(blue)三种颜色通道的变化来表示颜色。取值范围0-255|0%-100%
 * 2.HEX：和RGB相同，不同的是取值范围00-FF
 * 3.HSV：通过色相(hub)、饱和度(saturation)、明度(lightness)三种颜色通道的变化来表示变化。
 * H [0-360] S [0-1] V [0-1]
 * 色相：在不同波长的光照射下，人眼所感觉不同的颜色。它是一个分段函数。通过三原色可以演变出形成6色环、12色环、24色环的色相环或色相条。
 * 原色之间是线性变化的。
 * 饱和度：和掺入白色的量相关，掺入越少，越饱和。
 * 明度：和掺入黑色的量相关，掺入越少，越明亮。
 * 4.HSL: 通过色相(hub)、饱和度(saturation)、明度(lightness)三种颜色通道的变化来表示变化。
 * H和HSV是一个意思，SL不是一个意思
 * H [0-360] S [0-1] L [0-1]
 */

 // 调色板构造函数参数
interface PaletteOptions{
  width: string,
  height: string
}

// 调色板render参数
interface RenderOptions {
  x?: number,
  y?: number,
  rgb?: string
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
  width: number; // 画布宽度
  height: number; // 画布高度
  x: number; // 选择器的x坐标
  y: number; // 选择器y坐标
  rgb: string; // 色相rgb默认值(右上角颜色)

  constructor(container: HTMLElement, options: PaletteOptions) {
    this.width = parseInt(options.width);
    this.height = parseInt(options.height);
    this.x = this.width; // 默认值
    this.y = 0; // 默认值
    this.rgb = 'rgb(255, 0, 0)';

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
  public render(renderOptions?: RenderOptions) {
    if (renderOptions && renderOptions.x !== undefined) this.x = renderOptions.x;
    if (renderOptions && renderOptions.y !== undefined) this.y = renderOptions.y;
    if (renderOptions && renderOptions.rgb !== undefined) this.rgb = renderOptions.rgb;

    this.drawPalette();
    this.drawPicker();
  }

  /**
   * 绘制调色板
   * const rtRGB = 'rgb(255, 0, 0)'; // 右上角颜色（默认）
   * const lrRGB = 'rgb(255, 255, 255)'; // 左上角颜色
   * const lbRGB = 'rgb(0, 0, 0)'; // 左下角颜色
   * const rbRGB = 'rgb(0, 0, 0)'; // 右下角颜色
   */
  private drawPalette() {
    const w = this.width;
    const h = this.height;

    const piece = 255; // 总共多少份
    const defaultRGB = this.rgb;
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

  private onMouseDM(x: number, y: number) {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    this.x = x;
    this.y = y;
    this.render();
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
      this.mousemoveBtn(e);
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
      this.fire('change', this.getRGB());
    }
  }

  private mousemoveBtn(e: MouseEvent) {
    const barClientRect = this.bar.getBoundingClientRect();
    if (e.clientX < barClientRect.left) {
      this.btn.style.right = barClientRect.width + 'px';
    } else if (e.clientX > barClientRect.right) {
      this.btn.style.right = '0px';
    } else {
      this.btn.style.right = (barClientRect.right - e.clientX) + 'px';
    }
    this.right = parseInt(this.btn.style.right);
    this.fire('change', this.getRGB());
  }

  // 计算色相条当前的rgb
  public getRGB() {
    // 12色相的色环
    let hubSerial = [
      [255, 0, 0],
      [255, 0, 128],
      [255, 0, 255],
      [128, 0, 255],
      [0, 0, 255],
      [0, 128, 255],
      [0, 255, 255],
      [0, 255, 128],
      [0, 255, 0],
      [128, 255, 0],
      [255, 255, 0],
      [255, 128, 0],
      [255, 0, 0],
    ]
    hubSerial = hubSerial.reverse(); // 倒置计算
    const width = this.bar.clientWidth;
    const right = this.right;
    const pos = right/(width/12); // 分母
    const pos1 = Math.floor(pos);
    const pos2 = Math.ceil(pos);
    let r, g, b;
    if (pos1 !== pos2) {
      r = Math.round((hubSerial[pos1][0] + hubSerial[pos2][0]) * (pos - pos1));
      g = Math.round((hubSerial[pos1][1] + hubSerial[pos2][1]) * (pos - pos1));
      b = Math.round((hubSerial[pos1][2] + hubSerial[pos2][2]) * (pos - pos1));
    } else {
      r = Math.round(hubSerial[pos1][0]);
      g = Math.round(hubSerial[pos1][1]);
      b = Math.round(hubSerial[pos1][2]);
    }
    
    return {
      value: `rgb(${r}, ${g}, ${b})`,
      r,
      g,
      b
    };
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

// 颜色选择列表
class ColorSelect {
  el: HTMLElement;

  constructor(container) {
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

  private getColor() {
    return [
      'rgb(244, 67, 54)',
      'rgb(233, 30, 99)',
      'rgb(156, 39, 176)',
      'rgb(103, 58, 183)',
      'rgb(63, 81, 181)',
      'rgb(33, 150, 243)',
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
      // 'rgb(96, 125, 139)'
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

    this.hub.on('change', rgb => {
      this.palette.render({rgb: rgb.value});
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