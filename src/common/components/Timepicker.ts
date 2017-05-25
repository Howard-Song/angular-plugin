import { Directive, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { NgControl, FormGroupDirective } from '@angular/forms';

/**
 * bootstrap 的timepicker
 * 使用示例:
 * 
 * <div style="position:relative;">
 * 		<input timepicker="yy-MM-DD" />
 * </div>
 * 
 * 注意请确认父节点为relative；
 * timepicker可以设置时间选择后的格式，其余参数，参考
 * 
 * https://github.com/Eonasdan/bootstrap-datetimepicker
 */

@Directive({
	selector: '[timepicker]',
	inputs: ["timepicker", "mode", "minDate", "maxDate", "defaultDate"],
})
export class TimepickerDirective implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private nc: NgControl,
		private formGD: FormGroupDirective
	) { }

	ngOnInit() {
		$(this.elementRef.nativeElement).datetimepicker({
			format: this["timepicker"] || "YYYY-MM-DD",
			defaultDate: this["defaultDate"] || false,
			minDate: this["minDate"] || false,
			maxDate: this["maxDate"] || false,
			locale: "zh-cn",
			viewMode: this["mode"] || "days"
		}).on("dp.change", (e) => {
			try {
				this.formGD.control.controls[this.nc.name].setValue($(this.elementRef.nativeElement).val());
			} catch (e) {
				console.warn("请为 input 设置 formControlName!");
			}
			this.cdr.detectChanges();
		}).on("dp.show", (e) => {
			try {
				console.log($(this.elementRef.nativeElement).val());
				this.formGD.control.controls[this.nc.name].setValue($(this.elementRef.nativeElement).val());
			} catch (e) {
				console.warn("请为 input 设置 formControlName!");
			}
			this.cdr.detectChanges();
		}).on("dp.hide", (e) => {
			try {
				console.log($(this.elementRef.nativeElement).val());
				this.formGD.control.controls[this.nc.name].setValue($(this.elementRef.nativeElement).val());
			} catch (e) {
				console.warn("请为 input 设置 formControlName!");
			}
			this.cdr.detectChanges();
		});

		$(this.elementRef.nativeElement).val("");

	}
}
