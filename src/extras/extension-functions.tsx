import { useState } from "react";

export {};
declare global {
  interface String {
    toCompleteDateTime(): String;
    render(args: any): string;
  }
  interface Array<T> {
    contains(item: T): boolean;
    first(condition?: (value: T) => boolean): T;
    last(condition?: (value: T) => boolean): T;
    indexOfObject(item: T): number;
    remove(item: T): Array<T>;
    onEach(run: (it: T, index: number) => T): Array<T>;
  }
}
function getLocale() {
  return navigator.language || navigator.languages[0];
}

String.prototype.toCompleteDateTime = function () {
  let d = new Date(this + "");
  let f = new Intl.DateTimeFormat(getLocale(), {
    dateStyle: "short",
    timeStyle: "short",
  });
  return f.format(d);
};

const ascSort = (a: any, b: any) => (a > b ? 1 : a < b ? -1 : 0);

String.prototype.render = function () {
  "use strict";
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    var args =
      "string" === t || "number" === t
        ? Array.prototype.slice.call(arguments)
        : arguments[0];

    for (key in args) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }

  return str;
};

Array.prototype.onEach = function (
  func: (it: any, index: number) => any
): Array<any> {
  return this.map((it: any, index: number) => {
    func(it, index);
    return it;
  });
};

Array.prototype.indexOfObject = function (item: any): number {
  if (item.id)
    return this.findIndex((it) => it.id === parseInt(String(item.id)));
  return this.findIndex((it) => JSON.stringify(item) == JSON.stringify(it));
};
Array.prototype.contains = function (item: any) {
  return this.indexOfObject(item) >= 0;
};
Array.prototype.first = function (condition?: (value: any) => boolean) {
  let result = condition ? this.filter(condition) : this;
  if (result.length > 0) {
    return result[0];
  }
  return;
};
Array.prototype.last = function (condition?: (value: any) => boolean) {
  let result = condition ? this.filter(condition) : this;
  if (result.length > 0) {
    return result[result.length - 1];
  }
  return;
};
Array.prototype.remove = function (item: any) {
  if (this.contains(item)) {
    this.splice(this.indexOfObject(item), 1);
  }
  return this;
};

export class RecordList extends Array<Record> {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromList(list: any[]): RecordList {
    let instance = new RecordList();
    list.forEach((it: Record) => instance.push(it));
    return instance;
  }
  nextId(): number {
    if (this.length == 0) return 1;
    return (
      this.map((it) => it.id)
        .sort(ascSort)
        .last() + 1
    );
  }
  public add(item: any): RecordList {
    let id = this.nextId();
    this.push(Record.from(id, item));
    return this;
  }
  public delete(item: any): RecordList {
    this.splice(this.indexOf(item), 1);
    return this;
  }
  byId(id: number): any {
    return this.find((it) => it.id === parseInt(String(id)));
  }
}

export class Record {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
  static from(id: number, arg: any): any {
    return Object.assign(new Record(id), arg) as Record;
  }
}

export function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export const buildPath = (folder: any): string =>
  folder?.parent
    ? buildPath(folder.parent) + "/" + folder.name
    : "/" + folder?.name;
