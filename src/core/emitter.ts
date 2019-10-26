/**
 * 事件系统：管理事件的触发和监听
 */
class Emitter {
  events: object = {};

  on(type: string, fn: Function) {
    (this.events[type] || (this.events[type] = [])).push(fn);
  }

  once(type: string, fn: Function) {
    (this.events[type] || (this.events[type] = [])).push((...args: any) => {
      fn(...args);
      this.off(type, fn);
    })
  }

  off(type: string, fn: Function) {
    if (this.events[type]) {
      const index = this.events[type].indexOf(fn);
      if (index !== -1) this.events[type].splice(index, 1);
    }
  }

  fire(type: string, ...args: any) {
    this.events[type] && this.events[type].forEach(fn => {
      fn(...args);
    })
  }
}

const event = new Emitter()

export default event;