import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Config } from "./../../app/app.config";
import { DateRangeType_Helper, DateRangeType } from "./../../enums/DateRangeType";
import { NgControl, FormGroupDirective, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DateRangeHandler } from "./../models/DateRange";


/**
 * 使用例子
 * 
 * <div class="label-input inline" date-range="dateRange" label="日期">
        <input type="text" formControlName="dateRange" class="hide">
   </div>
 */

@Component({
	selector: '[date-range]',
	template: `
	<ng-content></ng-content>
	<input placeholder="时间区间" [value]="showStr" readonly [title]="showStr" (keyup)="clear($event)" (click)="focus($event)">
	<div class="input-range-list" *ngIf="showList">
	<form class="form-inline" [formGroup]="form">
      <div class="label-input inline" *ngFor="let item of days">
        <button class="btn btn-default radio-button btn-xs" [ngClass]="{
          'btn-warning':form.controls.range.value==item.value&&!freeMode
        }" (click)="freeMode=false;change(item)">{{item.text}}
          <input type="radio" formControlName="range" [value]="item.value">
        </button>
      </div><br>
      <div class="label-input inline" *ngFor="let item of months">
        <button class="btn btn-default radio-button btn-xs" [ngClass]="{
          'btn-warning':form.controls.range.value==item.value&&!freeMode
        }" (click)="freeMode=false;change(item)">{{item.text}}
          <input type="radio" formControlName="range" [value]="item.value">
        </button>
      </div><br>
      <div class="label-input inline" *ngFor="let item of years">
        <button class="btn btn-default radio-button btn-xs" [ngClass]="{
          'btn-warning':form.controls.range.value==item.value&&!freeMode
        }" (click)="freeMode=false;change(item)">{{item.text}}
          <input type="radio" formControlName="range" [value]="item.value">
        </button>
      </div><br>
      <div class="label-input inline" *ngFor="let item of weeks">
        <button class="btn btn-default radio-button btn-xs" [ngClass]="{
          'btn-warning':form.controls.range.value==item.value&&!freeMode
        }" (click)="freeMode=false;change(item)">{{item.text}}
          <input type="radio" formControlName="range" [value]="item.value">
        </button>
      </div><br>
	  <div class="freemode">
	  <button class="btn btn-default btn-xs" [ngClass]="{
          'btn-warning':freeMode
        }" (click)="freeMode=true;change()">自定义</button>
	  <div class="label-input inline" [ngClass]="{'disabled':!freeMode}">
		  <input formControlName="starttime" timepicker (blur)="change()" placeholder="开始时间">
      </div>
	  <div class="label-input inline" [ngClass]="{'disabled':!freeMode}">
		  <input formControlName="endtime" timepicker (blur)="change()" placeholder="结束时间">
      </div>
	  </div>
	  </form>
	</div>
	`
})
export class DateRangeEditor implements OnInit, OnDestroy {
	form: FormGroup;
	constructor(
		private elementRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private formGD: FormGroupDirective,
		// private nc: NgControl,
		private formBuilder: FormBuilder,
	) { }

	@Input("date-range") formControlName: string;
	@Output() private onchange = new EventEmitter();

	freeMode: boolean = false;

	days = [];
	months = [];
	years = [];
	weeks = [];

	showList: boolean = false;
	showStr: string = "";
	bindFN;
	focus(e: FocusEvent) {
		e.preventDefault();
		this.showList = true;
		let that = this;
		if (!this.bindFN) {
			this.bindFN = (e) => {
				that.blur(e);
			}
			setTimeout(() => {
				document.addEventListener("click", this.bindFN)
			}, 200);
		}
	}
	blur(e) {
		if (!$(e.target).parents(".input-range-list").length) {
			this.showList = false;
			this.bindFN && document.removeEventListener("click", this.bindFN);
			this.bindFN = undefined;
			this.cdr.detectChanges();
		}
	}
	clear(e) {
		e.target.value = this.showStr;
	}


	change(range) {
		setTimeout(() => {
			if (this.freeMode) {
				if (this.form.controls["starttime"].value && this.form.controls["endtime"].value) {
					this.showStr = this.form.controls["starttime"].value + "至" + this.form.controls["endtime"].value;
					this.formGD.control.controls[this.formControlName].setValue(DateRangeType[999] + "|" + this.form.controls["starttime"].value + "|" + this.form.controls["endtime"].value);
				}
			} else {
				if (range) {
					this.showStr = range.text;
					this.formGD.control.controls[this.formControlName].setValue(DateRangeType[range.value]);
				}
			}
			this.onchange.emit({
				text: this.showStr,
				value: this.formGD.control.controls[this.formControlName].value,
			})
		}, 200);
	}

	ngOnInit() {
		let dateRangeHandler = new DateRangeHandler;
		let dateRangeTypeHelper = new DateRangeType_Helper;
		let data = dateRangeHandler.makeList();
		this.days = data.days;
		this.months = data.months;
		this.years = data.years;
		this.weeks = data.weeks;
		this.form = this.formBuilder.group({
			range: [""],
			starttime: [""],
			endtime: [""],
		});
		$(this.elementRef.nativeElement).find("[formControlName=" + this.formControlName + "]").addClass("hide");
		if (this.formGD.control.controls[this.formControlName].value && DateRangeType[this.formGD.control.controls[this.formControlName].value]) {
			let defaultStr = dateRangeTypeHelper.valueIndex[DateRangeType[this.formGD.control.controls[this.formControlName].value]];
			if (defaultStr) {
				this.showStr = defaultStr;
			}
		}
		this.formGD.control.controls[this.formControlName].valueChanges.subscribe(item => {
			let _str = item && item.split("|")[0];
			let itemStr = dateRangeTypeHelper.getTextByValue(DateRangeType[_str] as any) || "";
			if (itemStr != this.showStr && !this.freeMode) {
				this.showStr = itemStr;
				this.formGD.control.controls[this.formControlName].setValue(item);
			}
		})
	}

	ngOnDestroy() {
		this.bindFN && document.removeEventListener("click", this.bindFN);
	}
}
