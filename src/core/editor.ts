/**
 * 编辑器区域类
 */
import Emitter from './emitter';

interface MatchPattern {
  type: string, // 可选值'tagName' | 'style' | 'tagNameAttribute',
  tagName?: string, // 'tagNameAttribute'
  attribute?: string | string[], // 'tagNameAttribute'
  value: any  // type为‘tagname’时，value为string；type为‘style’时，value为对象
}

class Editor extends Emitter {
  el: HTMLElement;
  currentSelection: Selection;
  currentRange: Range;

  constructor(container: HTMLElement) {
    super();

    this.el = document.createElement('div');
    this.el.className = 'richeditor_area';
    this.el.setAttribute('contenteditable', 'true');
    container.appendChild(this.el);

    this.currentSelection = window.getSelection();
    this.appendP();

    this.el.addEventListener('mouseup', this.fireRangeChange.bind(this));
    this.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.el.addEventListener('keyup', this.handleLine.bind(this)); // 使用keyup监听，使用keydown的话函数执行会超前一步
    // event.on('restorerange', this.restoreRange.bind(this));
  }

  // 使编辑器内部填充p标签
  private appendP() {
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    this.el.appendChild(p);
  }

  // 使编辑器内部始终存在一个p标签
  private handleLine(e) {
    if (e.keyCode === 8 && this.el.querySelectorAll('p').length === 0) {
      this.appendP()
    }
  }

  // 当执行document.execCommand时，Selection.getRangeAt(0)中的range对象会被覆盖掉
  getRange(): any {
    return this.currentSelection.rangeCount ? this.currentSelection.getRangeAt(0): null;
  }

  // 选区范围对象发生变化
  fireRangeChange() {
    this.fire('rangechange', this.getRange());
  }

  // 当鼠标离开编辑区域时，为了恢复选区而保存选区范围对象
  handleMouseLeave() {
    if (this.currentSelection && this.currentSelection.rangeCount) {
      this.currentRange = this.currentSelection.getRangeAt(0);
    }
  }

  // 恢复选区
  // 当点击toolbar时，编辑区会失去焦点, range对象无法通过selection.getRangeAt(0)获取
  restoreSelection() {
    if (this.currentRange) {
      this.currentSelection.removeAllRanges();
      this.currentSelection.addRange(this.currentRange);
      // 执行execCommand时，this.currentRange对象已经改变
      // setTimeout(() => {
      //   this.currentRange = this.getRange();
      //   this.fireRangeChange();
      // }, 0);
    }
  }

  // 使用document.execCommand命令时，需要一些额外的操作
  // 1.先focus文本编辑区
  // 2.恢复选区范围对象
  // 3.执行document.execCommand之后，选区对象中的范围对象被改变，需要重新保存范围对象
  execCommand(commandName: string, showDefaultUI: boolean = false, value: string = null) {
    // this.el.focus();
    this.restoreSelection();
    document.execCommand(commandName, showDefaultUI, value);
    this.currentRange = this.getRange();
    this.fireRangeChange();
  }

  // 选中选区是否与工具栏模式匹配
  match(matchPattern: MatchPattern): boolean {
    const range = this.getRange();
    if (!range) return false;
    
    // 获取节点链
    const startContainer = range.startContainer;
    let node = startContainer;
    let nodeChain = []; // 点击位置往上搜集的节点链
    while(node.nodeType === 3 || node !== this.el) {
      if (node.nodeType !== 3) nodeChain.push(node); // 排除text节点
      node = node.parentNode
    }

    const value = matchPattern.value;
    // value: string | array
    if (matchPattern.type === 'tagName') {
      if (typeof value === 'string') {
        return nodeChain.some(node => node.tagName === value);
      } else {
        return value.some(name => {
          return nodeChain.some(node => node.tagName === name);
        })
      }
    // value: object
    } else if (matchPattern.type === 'style') {
      return Object.keys(value).some(key => {
        return nodeChain.some(node => node.style[key] === value[key]);
      })
    // value: object
    } else if (matchPattern.type === 'tagNameAttribute') {
      const node = nodeChain.find(node => node.tagName === matchPattern.tagName);
      if (!node) return null;
      let attrValAttr = (typeof matchPattern.value === 'string') ? [matchPattern.value] : matchPattern.value;
      let value = attrValAttr.find(val => node.getAttribute(matchPattern.attribute) === val);
      return value;
    }
    return false;
  }
}

export default Editor;