import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { EnumMapper } from "./../models/EnumMapper";
import { NgControl, FormGroupDirective } from '@angular/forms';
import { EnumHelpers } from "./../models/EnumHelpers";

/**
 * 使用方法
 * 例如
 * <select enum-option type="MemberStatus" formControlName="status" excludes="1,2"> </select>
 * 关键字 enum-option
 * 参数 type 为枚举类型的名字
 */
@Component({
	selector: '[enum-option]',
	template: `
		<option value="" selected>请选择</option>
		<option *ngFor="let item of list" [value]="item.value">{{item.text}}</option>
	`
})
export class EnumOption implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private ChangeDetectorRef: ChangeDetectorRef,
		private formGD:FormGroupDirective,
	) { }
	enumHelper: EnumMapper;
	title: string;
	list: {
		value: string;
		text: string;
	}[] = [];

	@Input() private type: string;
	@Input() private value: string;
	@Input() private excludes: string;
	@Input("formControlName") private formControlName: string;

	ngOnInit() {
		EnumMapper.register(EnumHelpers.list);
		this.enumHelper = EnumMapper.getHelper(this.type);
		if (this.enumHelper) {
			this.title = this.enumHelper.title;
			for (var key in this.enumHelper.valueIndex) {
				this.list.push({
					value: key,
					text: this.enumHelper.valueIndex[key]
				})
			}
		}
		// console.log($(this.elementRef.nativeElement).val(this.formGD.control.controls[this.formControlName].value||""));
		// console.log(this.formGD.control.controls[this.formControlName].value);
		this.ChangeDetectorRef.detectChanges();
	}
}
