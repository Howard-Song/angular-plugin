import { Component, Directive, OnInit, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter } from '@angular/core';

export interface ScrollEvent {
	/**处理完成 */
	complete: () => void;
}

@Component({
	selector: '[scroll]',
	template: `
	<div *ngIf="_dealInfinite">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
		<circle transform="translate(8 0)" cx="0" cy="16" r="0"> 
			<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0"
			keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
		</circle>
		<circle transform="translate(16 0)" cx="0" cy="16" r="0"> 
			<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3"
			keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
		</circle>
		<circle transform="translate(24 0)" cx="0" cy="16" r="0"> 
			<animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6"
			keytimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline" />
		</circle>
		</svg>
	</div>
	`
})
export class ScrollComponent implements OnInit {
	constructor(
		private elementRef: ElementRef,
		private ChangeDetectorRef: ChangeDetectorRef
	) { }

	/**事件处理状态 */
	private _dealInfinite: boolean = false;
	@Output() private infiniteScroll = new EventEmitter();

	/**滚动检测 */
	private scrollDetector(): () => void {
		return () => {
			if (this.isScrollDirectiveVisiable && this.checkVisiable()) {
				if (!this._dealInfinite) {
					this._dealInfinite = true;
					this.infiniteScroll.emit({
						complete: () => {
							setTimeout(() => {
								this._dealInfinite = false;
								this._bind();
							}, 5);
						}
					});
				}
			}
		}
	}

	private checkVisiable(): boolean {
		let dom = this.elementRef.nativeElement;
		try {
			if (!$("body").find(dom).length) {
				return false;
			}
			while ($(dom).parent().length > 0) {
				if ($(dom).parent().css("display") != "none") {
					dom = $(dom).parent();
				} else {
					return false;
				}
			}
			return true;
		} catch (e) {
			return true;
		}
	}

	get isScrollDirectiveVisiable(): boolean {
		let target_top = this.elementRef.nativeElement.offsetTop;
		let view_top = 0;
		if ($(this.elementRef.nativeElement).parents(".main-container>ng-component").height()) {
			view_top = $(this.elementRef.nativeElement).parents(".main-container>ng-component").scrollTop() +
				$(this.elementRef.nativeElement).parents(".main-container>ng-component").height();
		} else {
			view_top = document.body.scrollTop + window.screen.availHeight;
		}
		if (target_top <= view_top) {
			return true;
		} else {
			return false;
		}
	}

	_timer: NodeJS.Timer;
	setTimer() {
		if (!this._timer) {
			this._timer = setInterval(() => {
				this._bind();
			}, 1000);
		}
	}
	clearTimer() {
		if (this._timer) {
			clearInterval(this._timer);
		}
	}

	/**绑定、取消绑定事件 */
	private _bind: () => void;
	private bind() {
		this._bind = this.scrollDetector();
		if ($(this.elementRef.nativeElement).parents(".main-container>ng-component").height()) {
			$(this.elementRef.nativeElement).parents(".main-container>ng-component").on("scroll", this._bind)
		} else {
			$(document).on("scroll", this._bind)
		}
		this.setTimer();
	}
	private unbind() {
		if ($(this.elementRef.nativeElement).parents(".main-container>ng-component").height()) {
			$(this.elementRef.nativeElement).parents(".main-container>ng-component").off("scroll", this._bind)
		} else {
			$(document).off("scroll", this._bind)
		}
		this.clearTimer();
	}

	ngOnInit() {
		this.bind();
		this.scrollDetector()();
	}
	ngOnDestroy() {
		this.unbind();
	}

}
