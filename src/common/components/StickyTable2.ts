import { Directive, OnInit, ElementRef, } from '@angular/core';

@Directive({
	selector: '[sticky-table2]'
})
export class StickyTableDirective2 implements OnInit {
	constructor(
		private elementRef: ElementRef
	) { }

	origin: HTMLElement;

	private _clone: HTMLElement;
	private get clone(): HTMLElement {
		if (!this._clone) {
			this.origin = $(this.elementRef.nativeElement).find("thead")[0];
			this._clone = $(this.elementRef.nativeElement).find("thead").clone()[0];
			$(this._clone).hide();
			$(this._clone).addClass("sticky-head");
			$(this._clone).insertBefore($(this.elementRef.nativeElement).find("thead"));
		}
		return this._clone;
	}

	private calcWidth() {
		let cloneDom = $(this.clone).find("tr th");
		let targetDom = $(this.elementRef.nativeElement).find("tbody tr")[0];
		$(this.clone).width($(this.origin).width());
		if (targetDom) {
			$(targetDom).find("td").map((index, dom) => {
				$(cloneDom[index]).width($(dom).width());
			})
		}
		let view_top = 0;
		if ($(this.elementRef.nativeElement).parent().length) {
			view_top = $(this.elementRef.nativeElement).parent().scrollTop();
		} else {
			view_top = document.body.scrollTop;
		}
		let tHeadHeight = $(this.elementRef.nativeElement).find("thead").height();

		$(this.clone).css("top", (view_top + "px"));
	}

	/**滚动检测 */
	private scrollDetector(): () => void {
		return () => {
			let target_top = $(this.elementRef.nativeElement).parent().scrollTop();
			let tHeadHeight = $(this.elementRef.nativeElement).find("thead").height();
			if (target_top >= tHeadHeight) {
				//show
				this.calcWidth();
				$(this.clone).show();
			} else {
				//hide
				$(this.clone).hide();
			}
		}
	}

	/**绑定、取消绑定事件 */
	private _bind: (e) => void;
	private bind() {
		this._bind = this.scrollDetector();
		if ($(this.elementRef.nativeElement).parent().length) {
			$(this.elementRef.nativeElement).parent().on("scroll", this._bind)
		} else {
			$(document).on("scroll", this._bind)
		}
	}
	private unbind() {
		if ($(this.elementRef.nativeElement).parent().length) {
			$(this.elementRef.nativeElement).parent().off("scroll", this._bind)
		} else {
			$(document).off("scroll", this._bind)
		}
	}

	ngOnInit() {
		this.clone;
		this.bind();
	}
	ngOnDestroy() {
		this.unbind();
	}
}
