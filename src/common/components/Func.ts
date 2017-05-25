import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { ServerProvider } from "common/providers/ServerProvider";
import { UtilProvider } from "common/providers/UtilProvider";
import { SysFuncID } from "./../../enums/SysFuncID";
import { SysUserProvider } from "./../../sys/providers/SysUserProvider";

@Directive({
	selector: '[func]',
})
export class FuncComponent implements OnInit {
	static UserFuncList: {
		[index: string]: boolean;
		[index: number]: boolean;
	};
	constructor(
		private elementRef: ElementRef,
		private cdr: ChangeDetectorRef,
		private sysUserProvider: SysUserProvider,
	) { }

	@Input() func: string;

	check() {
		if (FuncComponent.UserFuncList[SysFuncID[this.func]]) {
			this.elementRef.nativeElement.removeAttribute("func");
		} else {
			if (typeof SysFuncID[this.func] == "undefined") {
				this.elementRef.nativeElement.removeAttribute("func");
				$(this.elementRef.nativeElement).html(this.func + "权限不存在")
			} else
				this.elementRef.nativeElement.remove();
		}
	}

	ngOnInit() {
		if (!FuncComponent.UserFuncList) {
			this.sysUserProvider.getFuncIds().then(data => {
				FuncComponent.UserFuncList = data;
				this.check();
			})
		} else {
			this.check();
		}
	}
}
