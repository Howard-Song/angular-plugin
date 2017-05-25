import { Injectable } from '@angular/core';
import { Config } from "./../../app/app.config";

import { UtilProvider } from "./../../common/providers/UtilProvider";
import { ServerProvider } from "./../../common/providers/ServerProvider";
import { StorageProvider } from "./../../common/providers/StorageProvider";

@Injectable()
export class WXProvider {
    /**
     * 微信接口状态
     */
    private isready: boolean = false;
    /**
     * 微信权限列表
     */
    private apiList: string[] = Config.wxApiList;

    constructor(
        private UtilProvider: UtilProvider,
        private ServerProvider: ServerProvider,
        private StorageProvider: StorageProvider
    ) { }

    /**
     * 判断微信接口是否就绪?
     */
    isReady(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.isready) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    onReady(callback: Function): void {
        if (callback) {
            wx.ready(callback);
        }
    }

    close() {
        this.onReady(wx.closeWindow);
    }

    /**
     * 微信接口环境配置
     */
    config() {
        if (!this.isready) {
            //获取微信签名信息
            this.ServerProvider.get("/m/sys/wechat/getSignature", {
                params: {
                    url: encodeURIComponent(window.location.href.split("#")[0])
                }
            }).then(resp => {
                let _config: any = JSON.parse(resp.data);
                //开始配置微信
                wx.config({
                    debug: Config.wxDebug,
                    appId: Config.wxAppId,
                    timestamp: _config.timestamp,
                    nonceStr: _config.nonceStr,
                    signature: _config.signature,
                    jsApiList: this.apiList
                });
                wx.ready(() => {
                    this.isready = true;
                    wx.hideAllNonBaseMenuItem()
                });
            });
        }
    }

    /**
     * wx share功能
     */
    public share(share?: WXShareMsg) {
        this.onReady(() => {
            wx.hideAllNonBaseMenuItem();
            wx.showMenuItems({
                menuList: Config.wxShareItems // 要显示的菜单项，所有menu项见附录3
            });
            if (typeof share == "object") {
                wx.onMenuShareAppMessage(share);
                wx.onMenuShareTimeline(share);
            }
        });
    }
    public shareClose() {
        // wx.hideMenuItems({
        //     menuList: Config.wxShareItems // 要显示的菜单项，所有menu项见附录3
        // });
        this.onReady(() => {
            wx.hideAllNonBaseMenuItem();
        });
    }

    /**
     * 微信授权
     */
    // private wxInfo: any = this.StorageProvider.getObject("wxInfo") || {};
    public get openId(): string {
        return this.StorageProvider.get("wxOpenId") || '';
    }
    private get enviromentCheck(): {
        /** 微信 code */
        code?: string;
        /** 判断是否为微信浏览器 */
        isWXbrowser?: boolean;
    } {
        let wxEnviromentCheck = this.UtilProvider.parseUrlSearch();
        wxEnviromentCheck.isWXbrowser = window.navigator.userAgent.match(/MicroMessenger/ig) ? true : false;
        return wxEnviromentCheck;
    }

    /**获取微信授权 */
    auth(): boolean {
        //是否有微信的 openID
        if (this.openId) {
            return true;
        } else {
            if (this.enviromentCheck.code && this.enviromentCheck.isWXbrowser) {
                return true
            }
            else {
                this.redirectToAuth();
                return false;
            }
        }
    }

    /**前往微信授权页面 */
    redirectToAuth() {
        let base = "https://open.weixin.qq.com/connect/oauth2/authorize?";
        let params = {
            appid: Config.wxAppId,
            redirect_uri: encodeURIComponent(location.origin + location.pathname + location.hash),
            response_type: "code",
            scope: "snsapi_userinfo",
            state: "wx"
        };
        let paramsArray = [];
        for (let key in params) {
            paramsArray.push(key + "=" + params[key]);
        }
        window.location.href = base + paramsArray.join("&") + "#wechat_redirect";
    }

    /**
     * 获取微信 wxInfo
     */
    getOpenId(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.openId) {
                resolve(this.openId);
            } else {
                if (this.auth() && this.enviromentCheck.code) {
                    // "/m/mm/member/getOpenId", { params: { code: "weixinCode" } }
                    //从服务器获取openID
                    this.ServerProvider.get("/m/mm/member/getOpenId", {
                        params: {
                            code: this.enviromentCheck.code
                        }
                    }).then(resp => {
                        this.StorageProvider.set("wxOpenId", resp.data)
                        resolve(resp.data);
                    }, (e) => {
                        if (!"微信code过期了") {
                            this.redirectToAuth();
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            }
        });
    }

}

export interface WXUser {
    openid: string;
    nickname: string;
    sex: number;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    privilege: any[];
}

export interface WXShareMsg {
    /**分享标题 */
    title: string;
    /**分享描述 */
    desc: string;
    /**分享链接 */
    link: string;
    /**分享图标 */
    imgUrl: string;
    /**分享类型,music、video或link，不填默认为link */
    type?: string;
    /**如果type是music或video，则要提供数据链接，默认为空 */
    dataUrl?: string;
    /**分享成功回调 */
    success?: Function;
    /**用户取消分享回调 */
    cancel?: Function;
}