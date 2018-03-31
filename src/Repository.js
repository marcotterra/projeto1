"use strict";
export default class Repository {
  constructor() {
    this._values = [];
    this.sequence = 1;
  }

  save(order) {
    if (order.id != undefined && order.id != "") {
      let value = this._values.find(index => index.id == order.id);
      value.p = order.p;
      value.m = order.m;
      value.g = order.g;
      value.total = order.total;
    } else {
      order.id = this.sequence++;
      this._values.push(order);
    }
  }

  del(id) {
    let value = this._values.find(index => index.id == id);
    this._values.splice(value, 1);
  }

  findById(id) {
    let value = this._values.find(index => index.id == id);
    return value;
  }

  findAll() {
    return this._values;
  }
}
