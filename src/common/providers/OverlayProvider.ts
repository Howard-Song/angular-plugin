import { Injectable, ViewContainerRef, ComponentFactoryResolver, Component, ComponentRef, Injector } from '@angular/core';

import { AlertComponent } from "./../components/Alert";
import { ToastComponent } from "./../components/Toast";
import { LoadingComponent } from "./../components/Loading";
import { ConfirmComponent } from "./../components/Confirm";

import { BackdropModelViewComponent } from "./../components/BackdropModel";

@Injectable()
export class OverlayProvider {

	constructor(
		private cfr: ComponentFactoryResolver,
		private injector: Injector,
	) { }

	componentMaker(view: ViewContainerRef, component: any): any {
		let factory = this.cfr.resolveComponentFactory(component);
		let _component = view.createComponent(factory);
		return _component;
	}

	private _componentMaker(view: ViewContainerRef, component: any): any {
		let _component = this.componentMaker(view, component);
		_component.instance["close"] = () => {
			_component.destroy();
		};
		_component.instance["onClose"] = (fn: Function) => {
			_component.onDestroy(fn || (() => { }));
		};
		return _component.instance;
	}

	setView(view: ViewContainerRef, viewName: string) {
		this["_" + viewName] = view;
	}

	/**alert 提示框视图实例 */
	private _alert: ViewContainerRef;
	get alert(): AlertComponent & {
		onClose: Function;
	} {
		if (this._alert) {
			return this._componentMaker(this._alert, AlertComponent);
		} else {
			console.log("Alert view instance hasn't been inited!!!");
		}
	}

	/**toast 提示框视图实例 */
	private _toast: ViewContainerRef;
	get toast(): ToastComponent & {
		onClose: Function;
	} {
		if (this._toast) {
			return this._componentMaker(this._toast, ToastComponent);
		} else {
			console.log("Toast view instance hasn't been inited!!!");
		}
	}

	/**loading 提示框视图实例 */
	private _loading: ViewContainerRef;
	get loading(): LoadingComponent & {
		onClose: Function;
	} {
		if (this._loading) {
			return this._componentMaker(this._loading, LoadingComponent);
		} else {
			console.log("loading view instance hasn't been inited!!!");
		}
	}

	/**confirm 确认框视图实例 */
	private _confirm: ViewContainerRef;
	get confirm(): ConfirmComponent & {
		onClose: Function;
	} {
		if (this._confirm) {
			return this._componentMaker(this._confirm, ConfirmComponent);
		} else {
			console.log("confirm view instance hasn't been inited!!!");
		}
	}


	/**model 通用视图实例 */
	model: ViewContainerRef;
	modelCmpMaker(component: any): any {
		if (this.model) {
			return this.componentMaker(this.model, component);
		} else {
			console.log("model view instance hasn't been inited!!!")
		}
	}

	/**common 通用视图实例 */
	common: ViewContainerRef;
	commonCmpMaker(component: any): any {
		if (this.common) {
			return this.componentMaker(this.common, component);
		} else {
			console.log("common view instance hasn't been inited!!!")
		}
	}

	private popCmp(component: any, data: any, isPage: boolean = false, css?: string, disableBackdropClick?: boolean): CommonViewRef {
		try {
			/**设置promise */
			let resolve, reject, q = new Promise((r, j) => { resolve = r; reject = j; });
			document.body.style.overflow = "hidden";
			let view: ComponentRef<any> = isPage ? this.commonCmpMaker(BackdropModelViewComponent) : this.modelCmpMaker(BackdropModelViewComponent);
			// disableBackdropClick && (view.instance.disableBackdrop = true);
			typeof disableBackdropClick != "undefined" && (view.instance.disableBackdrop = disableBackdropClick);
			$(view.location.nativeElement).addClass(css || "");
			let _component: ComponentRef<any> = this.componentMaker((<BackdropModelViewComponent>view.instance).view, component);
			let viewInstance = {
				view: view,
				component: _component,
				instance: _component.instance,
				destroy: () => {
					view.destroy();
					_component.destroy();
					document.body.style.overflow = "auto";
				},
				then: (r = () => { }, j = () => { }) => {
					q.then(r, j);
				}
			};
			(<BackdropModelViewComponent>view.instance).isPage = isPage;
			(<BackdropModelViewComponent>view.instance).close = viewInstance.destroy;
			/**设置关闭函数 */
			if (typeof (<any>_component.instance).close == "undefined") {
				(<any>_component.instance).close = viewInstance.destroy;
			} else {
				(<any>_component.instance)['__close__'] = (<any>_component.instance).close;
				(<any>_component.instance).close = () => {
					(<any>_component.instance)['__close__']();
					viewInstance.destroy();
				}
			}
			/**设置参数 */
			if (data) {
				if (typeof (<any>_component.instance).setParams != "undefined") {
					(<any>_component.instance).setParams(data);
				} else {
					console.log("以下参数无法设置：", data);
				}
			}
			/**设置向调用者返回的数据 */
			view.onDestroy(() => {
				if (typeof (<any>_component.instance)._error_ == "boolean") {
					if (!(<any>_component.instance)._error_) {
						resolve((<any>_component.instance)._msg_);
					} else {
						reject((<any>_component.instance)._msg_);
					}
				};
				/**提醒试图检测变化 */
				view.changeDetectorRef.detectChanges();
				_component.changeDetectorRef.detectChanges();
			});
			/**提醒试图检测变化 */
			view.changeDetectorRef.detectChanges();
			_component.changeDetectorRef.detectChanges();
			return viewInstance;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * 以模态框的形式显示组件，无默认高度和宽度
	 */
	popModel(component: any, data?: any, css?: string, disableBackdropClick?: boolean): CommonViewRef {
		return this.popCmp(component, data, false, css, disableBackdropClick);
	}

	/**
	 * 以页面的形式显示组件，有默认高度和宽度
	 */
	popPage(component: any, data?: any, css?: string, disableBackdropClick?: boolean): CommonViewRef {
		return this.popCmp(component, data, true, css, disableBackdropClick);
	}
}

export interface CommonViewRef {
	/**组件容器 */
	view: ComponentRef<any>;
	/**组件实例 */
	component: ComponentRef<any>;
	/**组件实体 */
	instance: any;
	/**销毁当前组件 */
	destroy: () => void;
	/**接收可能的返回数据 */
	then: (resolve?, reject?) => void;
}