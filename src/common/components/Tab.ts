import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
	selector: 'tab-content',
	template: `
	<ng-content select="*"></ng-content>
	`
})
export class TabComponent implements OnInit {
	constructor(
		private elementRef: ElementRef
	) { }

	ngOnInit() {
		this.bind();
	}

	bind() {
		$(this.elementRef.nativeElement).find(".tab-name [tab]").map((index, dom) => {
			$(dom).on("click", (e) => {
				let tab = $(e.target).attr("tab");
				if (tab) {
					$(this.elementRef.nativeElement).find(".tab-name [tab]").removeClass("active");
					$(dom).addClass("active");
					$(this.elementRef.nativeElement).find(".tab-content").removeClass("active");
					$(this.elementRef.nativeElement).find(".tab-content[for=" + tab + "]").addClass("active");
				}
			})
		})
	}
}
