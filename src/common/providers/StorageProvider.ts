import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {
  storage = localStorage;
  get(key) {
    return this.storage.getItem(key) || null;
  }

  set(key, value) {
    this.storage.setItem(key, value);
  }

  getObject(key) {
    let value = this.get(key);
    let returnValue;
    if (value) {
      try {
        returnValue = JSON.parse(value);
      } catch (e) {
        returnValue = null;
      }
    } else {
      returnValue = null;
    }
    return returnValue;
  }

  setObject(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  /***
   * 设置一个cookie
   * @key  键名
   * @value  键值
   * @expiredays  有效时间,单位 秒
   */
  setCookie(key: string, value: any, expiredays?: number) {
    expiredays || (expiredays = 0);
    var exdate: any = new Date().valueOf() + (expiredays * 1000);
    exdate = new Date(exdate);
    document.cookie = key + "=" + (<any>window).escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
  }

}

