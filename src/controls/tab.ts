/**
 * tab 切换控件
 */

import Emitter from '../core/emitter';

interface Child {
  title: string;
  content: HTMLElement;
}

class Tab extends Emitter {
  public el: HTMLElement;
  public header: HTMLElement;
  public content: HTMLElement;
  public state: number;
  public tabList: Child[] = [];

  constructor(container: HTMLElement) {
    super();

    this.createElement(container);
    this.header.addEventListener('click', (e: MouseEvent) => this.onHeaderClick(e));
  }

  private createElement(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'rd_tab';
    container.appendChild(this.el);

    this.header = document.createElement('div');
    this.header.className = 'rd_tab-header';
    this.el.appendChild(this.header);

    this.content = document.createElement('div');
    this.content.className = 'rd_tab-content';
    this.el.appendChild(this.content);
  }

  public appendChild(child: Child) {
    this.tabList.push(child);

    const titleNode = document.createElement('div');
    titleNode.className = 'rd_tab-header-item';
    if (this.tabList.length === 1) titleNode.classList.add('active');
    titleNode.textContent = child.title;
    this.header.appendChild(titleNode);

    const contentNode = document.createElement('div');
    contentNode.className = 'rd_tab-content-item';
    if (this.tabList.length === 1) contentNode.classList.add('active');
    contentNode.appendChild(child.content);
    this.content.appendChild(contentNode);
  }

  private onHeaderClick(e: MouseEvent) {
    const target = <HTMLElement>e.target;
    if (!this.header.contains(target) || this.header === target) return;

    const children = Array.from(this.header.children);
    const index = children.findIndex(node => node === target);
    
    this.setActive(index);
  }

  public setActive(index: number) {
    this.state = index;

    this.tabList.forEach((item, i) => {
      if (i === index) {
        this.header.children[i].classList.add('active');
        this.content.children[i].classList.add('active');
        return;
      }
      this.header.children[i].classList.remove('active');
      this.content.children[i].classList.remove('active');
    })
  }
}

export default Tab;