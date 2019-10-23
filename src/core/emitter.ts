/**
 * 事件系统：管理事件的触发和监听
 */
class Emitter {
  events: object = {};

  on(type: string, fn: Function) {
    this.events[type] ? this.events[type].push(fn) : this.events[type] = [fn];
  }

  once(type: string, fn: Function) {
    const onceFn = (...args: any) => {
      fn(...args);
      this.off(type, fn);
    }
    this.events[type] ? this.events[type].push(onceFn): this.events[type] = [onceFn];
  }

  off(type: string, fn: Function) {
    this.events[type] && this.events[type].forEach(item => {
      if (item === fn) {
        const index = this.events[type].indexOf(fn);
        if (index > -1) this.events[type].splice(index, 1);
      }
    })
  }

  fire(type: string, ...args: any) {
    this.events[type] && this.events[type].forEach(fn => {
      fn(...args);
    })
  }
}

const event = new Emitter()

export default event;