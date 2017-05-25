import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MD5 } from './MD5'

import { Config } from "./../../app/app.config";

import { PhotoGallary } from "./../components/PhotoGallary";
import { OverlayProvider, CommonViewRef } from "./OverlayProvider";
import { StorageProvider } from "./StorageProvider";



/**
 * 常用工具类
 */
@Injectable()
export class UtilProvider {

  constructor(
    private router: Router,
    private overlayProvider: OverlayProvider,
    private domSanitizer: DomSanitizer,
    private storageProvider: StorageProvider,
  ) { }

  goDownloadApp(time?: number) {
    setTimeout(function () {
      window.location.href = Config.AppDownloadLink;
    }, time || 1000);
  }
  /***
   * 提示显示框
   * @config {
   *      title  提示标题 
   *      subtitle  提示副标题,可选
   *      button  按钮名称,可选,默认"确定"
   * }
   */
  private _preAlert;
  alert(config: {
    title: string,
    subtitle?: string,
    button?: string
  }): Promise<any> {
    this._preAlert && (this._preAlert.close());
    this._preAlert = this.overlayProvider.alert;
    return this._preAlert.show(config);
  }

  /**
   * 加载中
   * @msg:string  提示信息,可选
   * 
   * 返回对象,包括
   * show:function  显示加载
   * close:function  关闭加载
   */
  loading(msg?: string): {
    /**
     * 用于显示加载中方法
     */
    show: any;
    /**
     * 用于关闭加载中的方法
     */
    close: any;
    onclose: (callback: Function) => any;
  } {
    let loading = this.overlayProvider.loading;
    loading.set(msg);
    return {
      show: (msg?: string) => {
        loading.show(msg);
      },
      close: () => {
        loading.close();
      },
      onclose: (callback) => {
        loading.onClose(callback);
      }
    }
  }

  /** 
   * toast提示框
   * @msg:string 需要提示的内容
   * @position:string 显示提示框的位置,默认bottom,可选top,middle,bottom
   */
  toast(msg: string, position: string = "bottom") {
    this.overlayProvider.toast.show({
      content: msg,
      position: position
    })
  }

  stringSign(orgStr: string, key?: string): string {
    let md5 = new MD5();
    return md5.md5(orgStr, key);
  }

  /**
   * 遮盖层信息提示
   * @text:string 提示文字信息
   */
  overlay(text: string, buttonText?: string): {
    /**
     * 显示提示信息
     * @message:string
     */
    show: (message: string) => void;
    /**
     * 关闭显示层
     */
    close: () => void;
    /**
     * 显示层关闭时执行的回调函数
     * @callback:Function
     */
    onclose: (callback: Function) => void;
  } {
    let callback = () => { };
    let toast = this.overlayProvider.toast;
    toast.show({
      content: text,
      position: "middle",
      button: {
        name: buttonText || "取消",
        onclick: () => {
          return callback();
        }
      }
    });
    return {
      show: (message: string) => {
        toast.setContent(message);
      },
      close: () => {
        toast.close();
      },
      onclose: (fn: () => void) => {
        callback = fn;
      }
    }
  }

  /**
   * confirm提示框
   */
  confirm(config: {
    /**
     * 提示框标题
     */
    title: string;
    /**
     * 提示内容
     */
    content?: string;
    /**
     * 确定文字
     */
    okText?: string;
    okClick?: () => any;
    cancelText?: string;
    cancelClick?: () => any;
  }): Promise<any> {
    return this.overlayProvider.confirm.show({
      title: config.title,
      content: config.content,
      okText: config.okText,
      okClick: config.okClick,
      cancelText: config.cancelText,
      cancelClick: config.cancelClick
    });
  }

  /**
   * 提取网址的search参数
   */
  parseUrlSearch(url?: string): any {
    url = url || location.href;
    url.indexOf("?") > -1 ? (url = url.substr(url.indexOf("?") + 1)) : (url = "");
    url.indexOf("#") > -1 && (url = url.substr(0, url.indexOf("#")));
    let search = url;
    let searchArray = search.split("&");
    let searchObject = {};
    searchArray.map((value) => {
      if (value) {
        let key_value = value.split("=");
        searchObject[key_value[0]] = key_value[1];
      }
    })
    return searchObject;
  }

  stringifyUrlSearch(search: any = {}): string {
    if (typeof search == "object") {
      let searchArray = [];
      for (var key in search) {
        searchArray.push(key + "=" + search[key]);
      }
      return searchArray.join("&");
    } else {
      return search
    }
  }

  /**
   * 以模态框的形式显示组件
   */
  showModelHisList: CommonViewRef[] = [];
  showModel(component: any, data?: any, css?: string, disableBackdropClick?: boolean): CommonViewRef {
    let page = this.overlayProvider.popModel(component, data, css, disableBackdropClick);
    this.showModelHisList.push(page);
    return page;
  }

  showPageHisList: CommonViewRef[] = [];
  /**
   * 以页面的形式显示组件
   */
  showPage(component: any, data?: any, css?: string, disableBackdropClick?: boolean): CommonViewRef {
    let page = this.overlayProvider.popPage(component, data, css, disableBackdropClick);
    this.showPageHisList.push(page);
    return page;
  }
  clearPage() {
    let pages = this.showPageHisList;
    this.showPageHisList = [];
    pages.map(item => {
      item.destroy();
    });
  }
  clearModel() {
    let pages = this.showModelHisList;
    this.showModelHisList = [];
    pages.map(item => {
      item.destroy();
    });
  }

  private routerList: {
    [index: string]: string[];
  };
  private getAllRouter(routerConfig: any[]): {
    component: any;
    path: string;
  }[] {
    let router: any[] = [];
    routerConfig.map(item => {
      if (item.children) {
        router = router.concat(this.getAllRouter(item.children));
      } else if (item.component) {
        router.push(item);
      }
    });
    return router;
  }
  /**
   * 打开页面
   */
  resolveUrl(component: any, data?: any, path?: string) {
    if (typeof component == "string") {
      component = {
        name: component
      }
    }
    if (!this.routerList) {
      this.routerList = {};
      let routerConfig = this.getAllRouter(this.router.config);
      routerConfig.map(item => {
        if (this.routerList[item.component.name]) {
          this.routerList[item.component.name].push(item.path);
        } else {
          this.routerList[item.component.name] = [item.path];
        }
      });
    }
    if (this.routerList[component.name]) {
      console.log(this.routerList[component.name]);
      if (data) {
        this.storageProvider.setObject(component.name, data);
      }
      let _path: string = this.routerList[component.name][0];
      this.routerList[component.name].map(item => {
        if (item.match(":")) {
          _path = path;
        } else if (item == path) {
          _path = item;
        }
      })
      this.router.navigateByUrl(_path).then(() => {
        console.log("maybe success");
        localStorage.removeItem(component.name);
      }, () => {
        console.log("this is failed");
      });
    }
  }

  /**
   * 克隆出一份独立的对象，而非引用对象
   */
  clone(oldObj) {
    if (typeof (oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var i in oldObj)
      newObj[i] = this.clone(oldObj[i]);
    return newObj;
  }

  /**
   * 合并两个对象并且返回独立的新对象
   */
  extend(a, b) {
    var args = arguments;
    if (args.length < 2) return;
    var temp = this.clone(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
      for (var i in args[n]) {
        temp[i] = args[n][i];
      }
    }
    return temp;
  }

  clearUndefindInObject(a) {
    let b = {};
    if (typeof a == "object") {
      for (let key in a) {
        if (typeof a[key] != "undefined") {
          b[key] = a[key];
        }
      }
    }
    return b;
  }

  /**
   * 合并两个对象但是不会返回新值，而是修改原有对象
   */
  setObj(a, b) {
    if (typeof a == "object" && typeof b == "object") {
      for (var key in a) {
        if (typeof a[key] == "object") {
          this.setObj(a[key], b[key]);
        } else {
          b[key] && (a[key] = b[key]);
        }
      }
    }
    return a;
  }

  /**
   * 合并两个对象，不会创建新的对象，而是将对象b的值全部复制给a
   */
  setObjFull(a, b) {
    if (typeof a == "object" && typeof b == "object") {
      for (var key in b) {
        if (typeof a[key] == "object") {
          this.setObj(a[key], b[key]);
        } else {
          a[key] = b[key];
        }
      }
    }
    return a;
  }

  /**
   * 获取表单对象中有改动的值
   */
  getFormChange(formdata: FormGroup): boolean | {
    [index: string]: any;
  } {
    let data = {};
    let isChanged: boolean = false;
    for (var key in formdata.controls) {
      if (formdata.controls[key].dirty) {
        isChanged = true;
        data[key] = formdata.controls[key].value;
      }
    }
    return isChanged && data;
  }

  getFormValidData(FormGroup: FormGroup): {
    [index: string]: any;
  } {
    let data = {};
    for (var key in FormGroup.controls) {
      if (FormGroup.controls[key].valid) {
        data[key] = FormGroup.controls[key].value;
      }
    }
    return data;
  }

  /**
   * 将外部资源转变为可信赖的angular资源
   */
  trustSource(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url)
  }

  showPhoto(data: string[]) {
    return this.showPage(PhotoGallary, data, "photo-gallary-page");
  }

  /**
   * 传入字符串返回base64的二维码
   */
  private _qrcodeDom: HTMLElement;
  private _qrcodeInstance;
  private _logo: HTMLImageElement;
  private _url;

  _createQRCode(text): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this._qrcodeDom) {
        this._qrcodeDom = document.createElement("div");
        this._qrcodeDom.id = "qrcode" + new Date().valueOf();
      }
      if (!this._logo) {
        this._logo = document.createElement("img");
        this._logo.src = "assets/image/home/logo.png";
        this._logo.onload = () => {
          this._qrcodeInstance = this._qrcodeInstance || new QRCode(this._qrcodeDom);
          this._qrcodeInstance.makeCode(text);
          let canvas: HTMLCanvasElement = ($(this._qrcodeDom).children("canvas")[0]) as any;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(this._logo, canvas.width * 0.7 / 2, canvas.height * 0.7 / 2, canvas.width * 0.3, canvas.height * 0.3);
          resolve(canvas.toDataURL());
        }
      } else {
        this._qrcodeInstance = this._qrcodeInstance || new QRCode(this._qrcodeDom, {
          text: "tosgi",
          width: 300,
          height: 300,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        this._qrcodeInstance.makeCode(text);
        let canvas: HTMLCanvasElement = ($(this._qrcodeDom).children("canvas")[0]) as any;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this._logo, canvas.width * 0.7 / 2, canvas.height * 0.7 / 2, canvas.width * 0.3, canvas.height * 0.3);
        resolve(canvas.toDataURL());
      }
    })
  }

  /**
   * 检查dom属性值的 boolean
   * @param value 
   * @param defaultValue 
   */

  checkAttrBoolean(value: any, defaultValue: boolean = false): boolean {
    if (typeof value == "boolean") {
      return value;
    } else {
      if (value == "true") {
        return true;
      } else if (value == "false") {
        return false;
      } else {
        if (typeof value != "undefined") {
          return true;
        } else {
          return defaultValue;
        }
      }
    }
  }

  /**
   * 从表单默认控制器中获取默认值；
   */
  getFormDefault(value) {
    let values = {};
    for (var key in value) {
      values[key] = value[key][0];
    }
    return values
  }

  dateFormat(fmt: string): string {
    let time: Date = new Date();
    let o = {
      "M+": time.getMonth() + 1,                 //月份   
      "d+": time.getDate(),                    //日   
      "h+": time.getHours(),                   //小时   
      "m+": time.getMinutes(),                 //分   
      "s+": time.getSeconds(),                 //秒   
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度   
      "S": time.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 将以分隔符分割的字符串转为对象
   * 如  memberId,userName
   * 可变为  {memberId:true,userName:true}
   * @param str 
   */
  splitToObject(str: string): {
    [index: string]: boolean;
  } {
    if (typeof str == "string") {
      let arr = str.split(/[,.|/\\，。]/gi);
      let obj = {};
      arr.map(item => {
        obj[item] = true;
      });
      return obj;
    } else {
      return {};
    }
  }

  exportExcel(url: string, queryCond: any) {
    let params = [];
    if (typeof queryCond == "object") {
      for (let key in queryCond) {
        params.push(key + "=" + queryCond[key]);
      }
    }
    let a = document.createElement("a");
    a.href = Config.ServerHost + url + "?" + params.join("&");
    a.target = "_blank";
    a.click();
  }

  /**
   * base64 转为 blob
   */
  base64ToBlob(base64, mime?: string) {
    let baseInfo = base64.split(/[:;,]/g);
    if (baseInfo[0] == "data") {
      mime = baseInfo[1];
      base64 = baseInfo[3];
    }
    mime = mime || '';
    let sliceSize = 1024;
    let byteChars = window.atob(base64);
    let byteArrays = [];
    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      let slice = byteChars.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
  }

  /**
   * 压缩图片
   */
  minifyImage(file: File | Blob, mime?: string): Promise<Blob | File> {
    return new Promise((resolve, reject) => {
      try {
        (window as any).resize({
          file: file,
          maxWidth: 1366,
          maxHeight: 768,
          callback: (res) => {
            if (res.file) {
              resolve(this.base64ToBlob(res.file));
            } else {
              resolve(file);
            }
          },
          readAsDataURL: false,
          keepExif: true                    // by default, keepExif (jpg only)
        });
      } catch (e) {
        console.error("image resive failed");
        resolve(file);
      }
    });
  }
}
