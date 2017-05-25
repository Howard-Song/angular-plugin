import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgControl, FormGroupDirective } from "@angular/forms";
import { ServerProvider } from "common/providers/ServerProvider";

/**
 * 使用方法
 * 例如
 * 
 * 
##异步自动补全下拉选框

	使用例子
	   <div class="label-input label-right" label="上级渠道" asyn-list="" title="" url="" key-param="" display-field="" key-field="">
		<input type="text" formControlName="parentId" class="hide">
	   </div>
	其中 asny-list 为关键字，必须有，并且其值为下面 formControlName 的值
	title  为默认提示文字
	url  为异步加载链接，必须为GET请求
	key-param  为请求键值
	display-field  为显示出来的字段键值
	key-field  为选中时需要处理的字段键值

      <!-- 2 -- 租车企事业单位Id(org_Organ->organId) -->
      <div class="label-input inline" label="租车企事业单位"  asyn-list="organId" title="租车企事业单位" url="" key-param="organ" display-field="organName" key-field="organId">
        <input type="text" formControlName="organId" placeholder="请输入租车企事业单位" class="hide">
      </div>

 */
@Component({
	selector: '[asyn-list]',
	template: `
	<ng-content></ng-content>
	
    <div class="list-input">
      <input type="text" (focus)="showList=true" [placeholder]="title" (change)="clear($event)" (blur)="close()" [(ngModel)]="showStr" (keydown)="queryList($event)">
      <ul *ngIf="showList&&list.length">
        <li (click)="choose(item)" *ngFor="let item of list;" [title]="item[displayField]">{{item[displayField]}}</li>
      </ul>
    </div>
	`
})
export class AsynList implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private ChangeDetectorRef: ChangeDetectorRef,
		// private nc: NgControl,
		private formGD: FormGroupDirective,
		private serverProvider: ServerProvider
	) { }

	@Input("asyn-list") private formControlName: string;
	@Input() private title: string = "";
	@Input() private url: string;
	@Input("display-field") private displayField: string;
	@Input("key-field") private keyField: string;
	@Input("key-param") private keyParam: string;

	showList: boolean = false;
	showStr;
	private _queryHistory;
	private _input: HTMLInputElement;
	queryList(e) {
		if (!(this.url && this.displayField && this.keyField && this.keyParam)) {
			return;
		} else {
			this._input = e.target;
			this._queryHistory && clearTimeout(this._queryHistory);
			this._queryHistory = setTimeout(() => {
				if (this._input.value) {
					this.serverProvider.post(this.url, {
						params: {
							[this.keyParam]: this._input.value,
							value: this._input.value
						},
						data: {
							[this.keyParam]: this._input.value,
							value: this._input.value
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
	choose(item) {
		if (item && item[this.keyField]) {
			this.item = item;
			this.formGD.control.controls[this.formControlName].setValue(item[this.keyField]);
			this._input.value = item[this.displayField];
			this.ChangeDetectorRef.detectChanges();
		}
	}
	clear(e) {
		let str = $(e.target).val();
		if (this.item && str != this.item[this.displayField]) {
			this.formGD.control.controls[this.formControlName].setValue(str);
			this.ChangeDetectorRef.detectChanges();
		} else if (!this.item)
			this.formGD.control.controls[this.formControlName].setValue(str);
	}
	close() {
		setTimeout(() => {
			this.showList = false;
		}, 200)
	}

	ngOnInit() {
		$(this.elementRef.nativeElement).find("[formControlName=" + this.formControlName + "]").addClass("hide");
		this.formGD.control.controls[this.formControlName].valueChanges.subscribe(value => {
			if (this.item && value != this.item[this.displayField]) {
				this.item = undefined;
				this.showStr = value || "";
			} else {
				this.showStr = value || "";
			}
		});
	}
}
