import { Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';

@Component({
	selector: 'alert-overlay',
	template: `
	<div class="alert-container" *ngIf="visible">
      <div class="background-overlay"></div>
      <div class="alert-content">
        <div class="alert-body">
          <div class="title">{{title}}</div>
          <div class="subtitle">{{subtitle}}</div>
          <div class="buttons">
            <button class="btn btn-warning full-btn" type="button" (click)="close()">{{button?button:"确定"}}</button>
          </div>
        </div>
      </div>
    </div>
	`
})
export class AlertComponent implements OnInit {
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private elementRef: ElementRef
	) { }
	title: string;
	subtitle: string;
	button: string;
	visible: boolean = false;

	ngOnInit() { }

	/**
	 * 设置并显示提示框内容
	 */
	show(config: {
		/**提示框标题 */
		title: string;
		/**提示框副标题 */
		subtitle?: string;
		/**提示框按钮名称 */
		button?: string;
	}) {
		config.title && (this.title = config.title);
		config.subtitle && (this.subtitle = config.subtitle);
		config.button && (this.button = config.button);
		this.visible = true;
		this.changeDetectorRef.detectChanges();
		let resolve;
		let promise = new Promise((_resolve, _reject) => {
			resolve = () => {
				_resolve();
			};
		});
		let close = this.close;
		this.close = () => {
			close();
			resolve();
		};
		$(this.elementRef.nativeElement).find(".buttons button").focus();
		return promise;
	}

	/**
	 * 关闭提示框
	 */
	close() { }

}
