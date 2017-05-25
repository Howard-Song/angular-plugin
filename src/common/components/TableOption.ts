import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgControl, FormGroupDirective } from '@angular/forms';
import { Config } from "./../../app/app.config";
import { ServerProvider } from "common/providers/ServerProvider";
import { UtilProvider } from "common/providers/UtilProvider";

/**
 * 使用例子
 * <select table-option title="" url="" display-field="" key-field="" config="" (onchange)=""></select>
 * 关键字 table-option
 * 参数
 * title 默认提示文字
 * url 请求资源链接
 * display-field 要显示出来的字段键名
 * key-field 要输入的键名
 */

@Component({
	selector: '[table-option]',
	template: `
		<option value="">请选择</option>
		<option *ngFor="let item of list" [value]="item[keyField]" [selected]="item[keyField]==defaultValue">{{item[displayField]}}</option>
	`
})
export class TableOption implements OnInit, OnChanges {
	constructor(
		private elementRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private serverProvider: ServerProvider,
		private formGD: FormGroupDirective
	) { }
	defaultValue;
	@Input() private title: string;
	@Input() private url: string;
	@Input("display-field") private displayField: string;
	@Input("key-field") private keyField: string;
	@Input("formControlName") private fromControlName: string;
	private _config;
	private timestamp;
	private timer: NodeJS.Timer;
	@Input("config") private set config(config) {
		this._config = config;
		if (this._config) {
			let timestamp = this.timestamp = new Date().valueOf();
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				if (timestamp == this.timestamp)
					this.getList();
			}, 500);
		}
		// this.getList();
	};
	private get config() {
		return this._config;
	}
	@Output() private onchange = new EventEmitter();
	@HostListener("change", ["$event"]) change(e) {
		let id = e.target.value;
		this.list.some(item => {
			if (item[this.keyField] == id) {
				this.onchange.emit(item);
				return true;
			}
		})
	}

	ngOnChanges(e) {
	}

	list: any[];
	getList() {
		this.serverProvider.get(this.url, {
			params: this.config || {}
		}).then(resp => {
			this.list = resp.data;
			this.defaultValue = this.formGD.control.controls[this.fromControlName].value;
			this.cdr.detectChanges();
		})
	}

	ngOnInit() {
		if (this.url && this.displayField && this.keyField) {
			if (typeof this.config != "undefined") {
				if (this.config) {
					this.getList();
				}
			} else {
				this.getList();
			}
		} else {
			console.warn(`请根据示例写： 
			<select table-option title="" url="" display-field="" key-field=""></select>`)
		}
	}
}

/**
	 * 查询全表数据
	 * call url: /m/sys/util/listAll
	 * tableName表名
	 * fieldNames--返回字段名--name1,name2,name3
	 * isCache是否需要缓存,默认true
	 * isPullAll是否需要全表,默认true
	 * keyName 选中之后返回的值
	 * 
	 * 
	 * <select tableoption url="" keyName="" fieldNames="" isCache="" isPullAll="" config=""></select>
	 */

@Component({
	selector: '[tableoption]',
	template: `
		<option value="">请选择{{title}}</option>
		<option *ngFor="let item of list" [value]="item[keyName]">{{item['__show__']||''}}</option>
	`
})
export class TableOptionPlus implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private serverProvider: ServerProvider,
		private utilProvider: UtilProvider,
	) { }

	@Input("url") private url: string;
	@Input("keyName") private keyName: string;
	@Input("fieldNames") private fieldNames: string;
	@Input("isCache") private isCache: boolean;
	@Input("isPullAll") private isPullAll: boolean;
	_config;
	@Input("config") set config(value: any) {
		this._config = value;
		this.getList();
	};
	get config() {
		return this._config
	}

	list: any[];
	getList() {
		this.serverProvider.get(this.url, {
			params: this.utilProvider.extend({
				fieldNames: this.fieldNames,
				isCache: this.utilProvider.checkAttrBoolean(this.isCache),
				isPullAll: this.utilProvider.checkAttrBoolean(this.isCache),
			}, this.config || {})
		}).then(resp => {
			resp.data.map(item => {
				item["__show__"] = (() => {
					let fieldNames = this.fieldNames.split(",");
					let showStr = [];
					fieldNames.map(key => {
						showStr.push(item[key]);
					});
					return showStr.join(" ");
				})()
			})
			this.list = resp.data;
			this.cdr.detectChanges();
		})
	}

	ngOnInit() {
		if (this.url && this.keyName && this.fieldNames) {
			this.getList();
		} else {
			console.warn(`请根据示例写： 
			<select table-option title="" url="" display-field="" key-field=""></select>`)
		}
	}
}
