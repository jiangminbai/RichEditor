/**
 * 编辑器区域类
 */
import Emitter from './emitter';
import command from './command';

interface MatchPattern {
  type: string, // 可选值'tagName' | 'style' | 'tagNameAttribute',
  styleName?: string,
  tagName?: string, // 'tagNameAttribute'
  attribute?: string | string[], // 'tagNameAttribute'
  value?: any  // type为‘tagname’时，value为string；type为‘style’时，value为对象
}

class Editor extends Emitter {
  el: HTMLElement;
  selection: Selection = null;
  range: Range = null;

  constructor(container: HTMLElement) {
    super();

    this.el = document.createElement('div');
    this.el.className = 'richeditor_area';
    this.el.setAttribute('contenteditable', 'true');
    container.appendChild(this.el);
    this.appendP();

    this.saveSelection();
    // this.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    // 使用keyup监听，使用keydown的话函数执行会超前一步
    this.el.addEventListener('keyup', this.handleLine.bind(this));
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

  // 通过mouseup和selectionchange事件将最后的选区范围对象保存在编辑器中
  private saveSelection() {
    this.selection = window.getSelection();

    this.el.addEventListener('mouseup', () => {
      this.range = this.selection.getRangeAt(0);
    });

    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      this.selection = selection;
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!this.el.contains(range.startContainer)) return;
      this.range = range;
      this.fireRangeChange();
    })
  }

  // 选区范围对象发生变化
  private fireRangeChange() {
    this.fire('rangechange', this.range);
  }


  // 恢复选区
  // 当编辑区会失去焦点(比如点击toolbar), selection持有的range对象不指向编辑区
  public restoreSelection() {
    if (this.range) {
      this.selection.removeAllRanges();
      this.selection.addRange(this.range);
    }
  }

  // 当执行document.execCommand时，选区对象中的范围对象被改变，需要重新保存范围对象
  public saveRange() {
    this.range = this.selection.getRangeAt(0);
  }

  // 使用document.execCommand命令时，需要一些额外的操作
  // 1.先focus文本编辑区
  // 2.恢复选区范围对象
  // 3.执行document.execCommand之后，选区对象中的范围对象被改变，需要重新保存范围对象
  public execCommand(commandName: string, showDefaultUI: boolean = false, ...args: string[]) {
    this.el.focus();
    this.restoreSelection();
    command(this, commandName, showDefaultUI, ...args);
    this.saveRange();
    this.fireRangeChange();
  }

  // 获取选中的范围对象回溯的节点链
  public getNodeChain() {
    const range = this.range;
    if (!range) return [];
    
    // 获取节点链
    const startContainer = range.startContainer;
    let node = startContainer;
    const nodeChain: HTMLElement[] = []; // 点击位置往上搜集的节点链
    while(node.nodeType === 3 || node !== this.el) {
      if (node.nodeType !== 3) nodeChain.push(<HTMLElement>node); // 排除text节点
      node = node.parentNode
    }

    return nodeChain;
  }

  // 选中选区是否与工具栏模式匹配
  public match(matchPattern: MatchPattern): any {
    const range = this.range;
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
      if (value) {
        return Object.keys(value).some(key => {
          return nodeChain.some(node => node.style[key] === value[key]);
        })
      } else {
        for (let i = 0; i < nodeChain.length; i++) {
          const styleValue = nodeChain[i].style[matchPattern.styleName];
          if (styleValue) {
            return styleValue;
          }
        }
      }
      
    // value: object
    } else if (matchPattern.type === 'tagNameAttribute') {
      const node = nodeChain.find(node => node.tagName === matchPattern.tagName);
      if (!node) return null;
      if (value) {
        let attrValAttr = (typeof value === 'string') ? [value] : value;
        let val = attrValAttr.find(val => node.getAttribute(matchPattern.attribute) === val);
        return val;
      } else {
        let attr = matchPattern.attribute;
        return node.getAttribute(attr);
      }
    }
    return false;
  }
}

export default Editor;