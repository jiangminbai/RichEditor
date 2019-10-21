class Emitter {
  events: object = {};

  on(type: string, fn: Function) {
    this.events[type] ? this.events[type].push(fn) : this.events[type] = [fn];
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