import { Injectable, Injector } from '@angular/core';
import { Http, RequestOptionsArgs, URLSearchParams, QueryEncoder, ResponseContentType, Headers } from '@angular/http';
import { ResponseData } from './../models/ResponseData';
import { StorageProvider } from './StorageProvider'
import { Observable } from 'rxjs';
import { Observer } from 'rxjs/Observer';
import { UtilProvider } from './UtilProvider';
import { Config } from "./../../app/app.config";

export interface RequestOptions extends RequestOptionsArgs {
  params?: any;
  data?: any;
  /**
   * 默认为 json
   * 如果发送文件类型则需赋值 multipart
   */
  postType?: string;
  isCached?: boolean;
  allowByAuth?: boolean;
}

export interface RequestObject {
  [index: string]: any;
  [index: number]: any;
}
/**
 * 这个Provider 提供访问服务端的功能
 */
@Injectable()
export class ServerProvider {
  public host: string;

  constructor(
    private http: Http,
    private util: UtilProvider,
    private storage: StorageProvider,
    private injector: Injector
  ) {
    this.host = this.util.parseUrlSearch()["_host"] || Config.ServerHost;
  };

  private ___sid: string = "";
  get __sid(): string {
    return this.___sid || (this.___sid = this.util.parseUrlSearch()["__sid"]);
  }
  get __sk(): string {
    return this.storage.get("__sk");
  }

  private needLogin: boolean = false;
  private lastTimeData: string = "";
  private request(options: RequestOptions, retry: number = 0): Promise<ResponseData> {
    return new Promise<any>((resolve, reject) => {
      // 添加session
      // (<URLSearchParams>options.search).set("__sid", this.__sid);
      // (<URLSearchParams>options.search).set("__sk", this.__sk);
      if (this.needLogin && !options.allowByAuth) {
        return reject();
      }
      this.http.request(options.url, options)
        .toPromise()
        .then((resp: any) => {
          let jsonData: ResponseData = resp.json();
          this.needLogin = false;
          if (jsonData.code == ResponseData.Code_OK) {
            resolve(jsonData);
          } else if (jsonData.code == ResponseData.Code_error) {
            this.util.alert({
              title: "警告",
              subtitle: jsonData.msg
            });
            reject(jsonData);
            console.error("请求出错", options.url, jsonData);
          } else if (jsonData.code == ResponseData.Code_fatal) {
            console.error(jsonData.msg);
            this.util.alert({
              title: "请求失败",
              subtitle: jsonData.msg
            });
            reject(jsonData);
            console.error("请求出错", options.url, jsonData);
          } else if (jsonData.code == ResponseData.Code_Login) {
            window.location.hash = "#/login";
            reject(jsonData);
            console.error("请求出错", options.url, jsonData);
          } else if (jsonData.code == ResponseData.Code_Hint) {
            reject(jsonData);
            console.error("请求出错", options.url, jsonData);
          } else if (jsonData.code == ResponseData.Code_needCode) {
            console.error(jsonData.msg);
            this.util.alert({
              title: "请求失败",
              subtitle: jsonData.msg
            });
            console.error("请求出错", options.url, jsonData);
            reject(jsonData);
          } else {
            //请求失败
            // this.util.alert({
            //   title: "请求失败",
            //   subtitle: jsonData.msg
            // });
            this.util.toast(options.url + "请求失败");
            console.error("请求出错", options.url);
            reject(jsonData);
          }
        },
        e => {
          //请求失败
          // this.util.alert({
          //   title: "请求失败",
          //   subtitle: e.msg ? e.msg : ""
          // });
          this.util.toast(options.url + "请求失败");
          console.error("请求出错", options.url);
          reject();
        });
    });
  }

  /**
       * 转换GET参数
       * @_params {
       *      参数为对象 key-value 或者 字符串
       * }
       */
  private parse_params(_params?: string | RequestObject): string | URLSearchParams {
    _params || (_params = {});
    if (typeof _params == "string") {
      let obj = {};
      let temp: string[] = _params.split("&");
      temp.map((item) => {
        let value = item.split("=");
        obj[value[0]] = value[1];
      })
      _params = obj;
    }

    let params = new URLSearchParams("", new QueryEncoder());
    for (let key in _params) {
      if (typeof _params[key] != "undefined")
        params.set(key, _params[key]);
    }

    //此处必须保证params为URLSearchParams
    return params;
  }

  private parse_post_data(data?: RequestObject): FormData {
    let form = new FormData();
    if (typeof data == "object") {
      for (let key in data) {
        let value = data[key];
        if (data[key] instanceof File || data[key] instanceof Blob) {
          form.append(key, value);
        } else if (typeof data[key] == "object") {
          form.append(key, JSON.stringify(data[key]));
        } else {
          form.append(key, value);
        }
      }
    }
    return form;
  }

  private analyse(options: RequestOptions): RequestOptions {
    // 拼凑地址
    (!options.url.match(/^http/ig)) && (options.url = this.host + options.url);
    // 处理GET请求数据
    (options.params || (options.params = {})) && (options.search = this.parse_params(options.params));
    // 处理POST请求数据
    if (options.data) {
      // if (options.search.toString())
      //   options.url = options.url + "?" + options.search.toString();
      if (options.postType == "multipart") {
        options.body = this.parse_post_data(options.data);
      } else {
        options.body = JSON.stringify(options.data);
      }
    }
    // 设置相应文档类型
    options.responseType = ResponseContentType.Json;
    options.withCredentials = true;
    return options;
  }

  /**
   * 使用 get 请求 后台服务
   */
  get(url: string, options?: RequestOptions): Promise<ResponseData> {
    options = options || {};
    options.url = url;
    options.method = "GET";
    options = this.analyse(options);
    return this.request(options);
  }


  /**
   * 该方法只供测试使用
   */
  private testRequest(feature: string, options: RequestOptions): Promise<any> {
    console.log("开始测试：" + feature);
    return new Promise<any>((resolve, reject) => {
      this.http.request(options.url, options)
        .toPromise()
        .then(resp => {
          let jsonData: ResponseData = resp.json();
          console.log("测试：" + feature);
          console.log(options);
          console.log(jsonData);
          return ResponseData;
        },
        e => {
          console.error(e);
          reject();
        });
    });
  }

  /**
   * 测试 get 使用，不处理错误
   */
  testGet(description: string, url: string, options?: RequestOptions): Promise<any> {
    options = options || {};
    options.url = url;
    options.method = "GET";
    options = this.analyse(options);
    return this.testRequest(description, options);
  }

  /**
   * 测试 get 使用，不处理错误
   */
  testPost(description: string, url: string, options?: RequestOptions): Promise<any> {
    options = options || {};
    options.url = url;
    options.method = "POST";
    options = this.analyse(options);
    return this.testRequest(description, options);
  }

  /**
   * 使用 post 请求 后台服务
   */
  post(url: string, options?: RequestOptions): Promise<ResponseData> {
    options = options || {};
    options.url = url;
    options.method = "POST";
    options.data || (options.data = {});
    options = this.analyse(options);
    return this.request(options);
  }

  /**
   * 发送表单post请求 
   * content-type 为 multipart
   */
  form(url: string, options?: RequestOptions): Promise<ResponseData> {
    options = options || {};
    options.url = url;
    options.method = "POST";
    options.postType = "multipart";
    options = this.analyse(options);
    return this.request(options);
  }

  public createObservable(data: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data);
      observer.complete();
    });
  }
  fetchTable(config): Promise<any> {
    return this.queryList(config.params, config.pageindex + 1, config.pagesize, config.orderDesc_, config.order, config.url).then(data => {
      let rows, count, pageLength = 0;
      rows = data.list;
      count = data.total;
      if (config.params.pagesize) {
        config.pagesize = parseInt(config.params.pagesize);
      }
      if (config.params.pageindex) {
        config.pageindex = parseInt(config.params.pageindex);
      }
      if (config.params.order) {
        config.order = config.params.order;
      }
      if (config.params.orderDesc_) {
        config.orderDesc_ = config.params.orderDesc_;
      }
      if (count < config.pagesize) {
        pageLength = 1;
      } else {
        pageLength = Math.ceil(count / config.pagesize);
      }
      let numList = [];
      for (let i = 0; i < pageLength; i++) {
        numList.push(i + 1);
      }
      let pageData = {
        rows: rows,
        count: count,
        pageLength: pageLength,
        pageNum: numList
      }
      return pageData;
    }, () => {

    });
  }

  fetchDataPromise: Promise<any>;
  /**
   * 专门读入数据
   * @param config 
   */
  fetchData(config): Promise<any> {
    let dataList = {
      count: 0,
      rows: []
    }
    let query = (config, dataList) => {
      return this.queryList(config.params, (config.offset || 0) + 1, (config.limit || 10), config.orderDesc_, config.order, config.url).then(data => {
        const start = config.offset * config.limit;
        const end = start + config.limit;
        dataList.count = data.total;
        if (config.offset > 0) {
          let arr = new Array(config.offset * config.limit);
          dataList.rows = arr.concat(data.list);
        } else {
          dataList.rows = data.list;
        }
        if (config.sort) {
          $(".icon-prev").trigger("click");
        }
        return dataList;
      });
    }
    if (!this.fetchDataPromise) {
      this.fetchDataPromise = query(config, dataList)
      return this.fetchDataPromise;
    } else {
      let promise = new Promise((resolve, reject) => {
        this.fetchDataPromise.then(() => {
          query(config, dataList).then((resp) => {
            resolve(resp);
          }, e => {
            reject(e);
          });
        }, () => {
          query(config, dataList).then((resp) => {
            resolve(resp);
          }, e => {
            reject(e);
          });
        });
      });
      return this.fetchDataPromise = promise;
    }
  }
  private queryList(params, index: number, size: number, orderDesc: string, prop: string, url: string): Promise<{ list: any[], total: number }> {
    return this.post(url, {
      params: $.extend({
        pageindex: index,
        pagesize: size,
        orderDesc_: orderDesc,
        order: prop
      }, params),
      data: params
    }).then(resp => {
      return {
        list: resp.data,
        total: resp.exData
      };
    });
  }

}