class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, fn) {
    this.events[type] ? this.events[type].push(fn) : this.events[type] = [fn];
  }

  off(type, fn) {
    this.events[type] && this.events[type].forEach(item => {
      if (item === fn) {
        const index = this.events[type].indexOf(fn);
        if (index > -1) this.events[type].splice(index, 1);
      }
    })
  }

  fire(type, ...args) {
    this.events[type] && this.events[type].forEach(fn => {
      fn(...args);
    })
  }
}

const event = new EventEmitter();

class Item {
  setActive() {
    this.el.classList.add('active');
    this.selected = true;
  }
  resetActive() {
    this.el.classList.remove('active');
    this.selected = false;
  }
  changeActive() {
    this.selected ? this.resetActive() : this.setActive();
  }
}

class BoldItem extends Item {
  constructor(container) {
    super();
    this.container = container;
    this.selected = false;
    this.el = document.querySelector('.menu-item-bold');
    this.handleClick();
    event.on('rangechange', currentRange => {
      const startContainer = currentRange.startContainer;
      const parent = startContainer.parentNode;
      const tagName = parent.tagName;
      tagName === 'B' ? this.setActive() : this.resetActive();
    })
  }

  handleClick() {
    this.el.addEventListener('click', () => {
      this.changeActive();
      this.container.currentSelection.removeAllRanges();
      this.container.currentSelection.addRange(this.container.currentRange);
      document.execCommand('bold');
      this.container.currentRange = this.container.currentSelection.getRangeAt(0);
    })
  }
}

class Container {
  constructor() {
    this.el = document.querySelector('.rich-editor_container');
    this.currentSelection = null;
    this.currentRange = null;
    this.handleMouseDown();
    this.handleMouseup();
    this.handleMouseLeave();
  }

  handleMouseDown() {
    this.el.addEventListener('mousedown', () => {
      this.currentSelection = this.currentSelection || window.getSelection();
    })
  }

  handleMouseup() {
    this.el.addEventListener('mouseup', () => {
      this.currentRange = this.currentSelection.getRangeAt(0);
      event.fire('rangechange', this.currentRange);
    })
  }

  handleMouseLeave() {
    this.el.addEventListener('mouseleave', () => {
      if (this.currentSelection) {
        this.currentRange = this.currentSelection.getRangeAt(0);
        event.fire('rangechange', this.currentRange);
      }
    })
  }
}

class RichEditor {
  constructor() {
    this.el = document.querySelector('.rich-editor_container');
    this.init();
    new BoldItem(new Container());
  }

  init() {
    this.appendP();
    this.handleLine();
  }

  appendP() {
    const p = document.createElement('p');
    const br = document.createElement('br');
    p.appendChild(br);
    this.el.appendChild(p);
  }

  handleLine() {
    this.el.addEventListener('keydown', (e) => {
      setTimeout(() => {
        if (e.keyCode === 8 && this.el.querySelectorAll('p').length === 0) {
          this.appendP()
      }
      }, 100);
    })
  }
}

new RichEditor();