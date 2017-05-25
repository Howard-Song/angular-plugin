import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle, } from '@angular/router';

import { SysUserProvider } from "./../../sys/providers/SysUserProvider";
import { SysProvider } from "./../../sys/providers/SysProvider";
import { UtilProvider } from "./UtilProvider";

@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild, CanLoad {
	constructor(
		private sysUserProvider: SysUserProvider,
		private sysProvider: SysProvider,
		private utilProvider: UtilProvider
	) { }
	private firstload = true;

	canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
		return this.beforeLoad(route);
	}

	canActivateChild(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}

	canLoad(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}

	beforeLoad(route: ActivatedRouteSnapshot): Promise<boolean> {
		let loading = this.utilProvider.loading("正在加载数据");
		if (this.firstload) {
			loading.show();
		}
		return new Promise((resolve, reject) => {
			if (route.url.length && route.url[0].path == "login") {
				this.firstload = false;
				loading.close();
				this.clearLoginData();
				resolve(true);
			} else {
				this.loadAllYouNeed().then(() => {
					loading.close();
					resolve(true);
				}, () => {
					loading.close();
					resolve(false);
				})
			}
		});
	}

	clearLoginData() {
		this.sysProvider.clearServerList();
		this.sysUserProvider.funcIds = null;
	}

	/**
	 * 提前加载所需数据
	 */
	loadAllYouNeed(): Promise<boolean> {
		return this.allPromise([new Promise((resolve, reject) => {
			this.loadSysUserInfo().then(() => {
				this.allPromise([this.loadSysServerList(), this.loadSysUserFuncIds()]).then(() => {
					resolve();
				}, () => {
					reject();
				});
			}, () => {
				reject();
			})
		})])
	}

	allPromise(promise: Promise<any>[]): Promise<boolean> {
		return Promise.all(promise).then(() => {
			return true;
		}, () => {
			return false
		})
	}

	loadSysUserInfo(): Promise<any> {
		return this.sysUserProvider.getInfo();
	}

	loadSysServerList(): Promise<any> {
		return this.sysProvider.getServerList();
	}

	loadSysUserFuncIds(): Promise<any> {
		return this.sysUserProvider.getFuncIds();
	}
}

export class CustomReuseStrategy implements RouteReuseStrategy {

	reuseNum: number = 3;

	shouldStore(path) {
		if (path && (path.match(/list/gi) || path.match(/query/gi))) {
			return true
		}
	}

	handlers: {
		history: DetachedRouteHandle,
		path: string;
	}[] = [];

	get(path?: string) {
		let handle;
		this.handlers = this.handlers.splice(this.handlers.length - this.reuseNum, this.reuseNum);
		this.handlers.some(item => {
			if (item.path == path) {
				handle = item.history;
				return true;
			}
		});
		return handle;
	}

	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		// console.debug('CustomReuseStrategy:shouldDetach', route);
		localStorage.setItem("dataTableRefreshStatus", new Date().valueOf().toString());
		return true;
	}

	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
		// console.debug('CustomReuseStrategy:store', route, handle);
		if (this.shouldStore(route.routeConfig.path)) {
			this.handlers.push({
				history: handle,
				path: route.routeConfig.path
			});
		}
	}

	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		// console.debug('CustomReuseStrategy:shouldAttach', route);
		return !!route.routeConfig && !!this.get(route.routeConfig.path);
	}

	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		// console.debug('CustomReuseStrategy:retrieve', route);
		// localStorage.setItem("dataTableRefreshStatus", new Date().valueOf().toString());
		if (!route.routeConfig) return null;
		return this.get(route.routeConfig.path);
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		// console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
		return future.routeConfig === curr.routeConfig;
	}

}
