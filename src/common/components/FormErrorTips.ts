import { Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgControl, FormGroupDirective } from '@angular/forms';

@Directive({
	selector: '[formControlName]',
})
export class FormErrorTips implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private ChangeDetectorRef: ChangeDetectorRef,
		private formGD: FormGroupDirective,
	) { }

	@Input() errorPosition: string
	@Input() errorTip: string;
	@Input() formControlName: string;
	@HostListener("blur", ["$event"]) change(e) {
		if (this.formGD.control.controls[this.formControlName].invalid) {
			let text = this.errorTip || this.resolveError(this.formGD.control.controls[this.formControlName].errors);
			let tooltip = $(this.elementRef.nativeElement).tooltip({
				title: text,
				trigger: "manual",
				placement: this.errorPosition || "auto right"
			}).tooltip("show");
			setTimeout(() => {
				tooltip.tooltip("destroy");
			}, 5000);
		}
	}

	resolveError(error: {
		[index: string]: any;
	}): string {
		console.log(error);
		let _key, tip;
		for (var key in error) {
			_key = key;
			tip = error[key];
			break;
		}
		if (typeof tip == "string") {
			return tip;
		}
		switch (_key) {
			case "required":
				return "必填字段";
			case "interger":
				return "必须是整数";
			case "decimal":
				return "必须是小数";
			case "number":
				return "必须是数字";
			case "min":
				return "数字太小了";
			case "max":
				return "数字太大了";
			default:
				return "填写不正确";
		}
	}

	ngOnInit(): void { }
}
