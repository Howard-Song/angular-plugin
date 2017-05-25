import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgControl, FormGroupDirective } from "@angular/forms";
import { ServerProvider } from "common/providers/ServerProvider";
import { UtilProvider } from "common/providers/UtilProvider";

/**
 * 自动补全
 * call url: /m/sys/util/autoCompletion
 * tableName表名
 * idNames--需要匹配的字段--name1,name2,name3
 * idValue--查询值
 * fieldNames--返回字段名--name1,name2,name3
 * isCache是否需要缓存,默认true
 * isPullAll是否需要全表,默认true
 * 
 * 
 * <!-- 2 -- 租车企事业单位Id(org_Organ->organId) -->
      <div class="label-input inline" label="租车企事业单位"  asynlist="organId" title="租车企事业单位"  tableName idNames idValue fieldNames isCache isPullAll keyField>
        <input type="text" formControlName="organId" placeholder="请输入租车企事业单位" class="hide">
      </div>
 */

@Component({
	selector: '[asynlist]',
	template: `
	<ng-content></ng-content>
	
    <div class="list-input">
      <input type="text" (focus)="showList=true" [placeholder]="title" (change)="clear($event)" (blur)="close()" (ngModel)="showStr" (keydown)="queryList($event)">
      <ul *ngIf="showList&&list.length">
        <li (click)="choose(item)" *ngFor="let item of list;" [title]="item[displayField]">{{item[displayField]}}</li>
      </ul>
    </div>
	`
})
export class AsynTableList implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private ChangeDetectorRef: ChangeDetectorRef,
		// private nc: NgControl,
		private formGD: FormGroupDirective,
		private serverProvider: ServerProvider,
		private utilProvider: UtilProvider
	) { }

	getNameArray(str: string): string[] {
		let strArr = [];
		let _str = str.split(/[,/|、]/gi);;
		_str.map(s => {
			if (s) {
				strArr.push(s);
			}
		})
		return strArr;
	}

	@Input("asynlist") private formControlName: string;
	@Input("url") private url: string;
	@Input("tableName") private tableName: string;
	@Input("idNames") private idNames: string;
	@Input("idValue") private idValue: string;
	@Input("fieldNames") private fieldNames: string;
	@Input("isCache") private isCache: boolean;
	@Input("isPullAll") private isPullAll: boolean;
	@Input("keyField") private keyField: string;

	showList: boolean = false;
	showStr;
	private _queryHistory;
	private _input: HTMLInputElement;
	queryList(e) {
		if (!(this.tableName && this.keyField && this.idNames)) {
			return;
		} else {
			this._input = e.target;
			this._queryHistory && clearTimeout(this._queryHistory);
			this._queryHistory = setTimeout(() => {
				if (this._input.value) {
					this.serverProvider.get(this.url, {
						params: {
							tableName: this.tableName,
							idNames: this.idNames,
							idValue: this.idValue,
							fieldNames: this.fieldNames,
							isCache: this.utilProvider.checkAttrBoolean(this.isCache),
							isPullAll: this.utilProvider.checkAttrBoolean(this.isPullAll)
						}
					}).then(resp => {
						if (resp.data instanceof Array) {
							this.list = resp.data;
						} else {
							this.list = [];
						}
						this.ChangeDetectorRef.detectChanges();
					});
				} else {
					this.list = [];
					this.ChangeDetectorRef.detectChanges();
				}
			}, 300);
		}
	}
	list = [];
	item;
	_oldInput;
	choose(item) {
		if (item && item[this.keyField]) {
			this.item = item;
			this.formGD.control.controls[this.formControlName].setValue(item[this.keyField]);
			this._input.value = (() => {
				let strArr = [];
				let keys = this.getNameArray(this.fieldNames);
				keys.map(key => {
					if (item[key]) {
						strArr.push(item[key]);
					}
				});
				return strArr.join(" ");
			})();
			this._oldInput = this._input.value;
			this.ChangeDetectorRef.detectChanges();
		}
	}
	clear(e) {
		let str = $(e.target).val();
		if (this.item && str != this._oldInput) {
			this.formGD.control.controls[this.formControlName].setValue("");
			this.ChangeDetectorRef.detectChanges();
		}
	}
	close() {
		setTimeout(() => {
			this.showList = false;
		}, 200)
	}

	ngOnInit() {
		$(this.elementRef.nativeElement).find("[formControlName=" + this.formControlName + "]").addClass("hide");
	}
}
