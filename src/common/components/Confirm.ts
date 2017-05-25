import { Component, OnInit, Sanitizer, SecurityContext, ChangeDetectorRef } from '@angular/core';
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'confirm-overlay',
	template: `
	<div class="confirm-container">
		<div class="background-overlay"></div>
		<div class="confirm-body">
			<div class="title">{{title}}</div>
			<div class="text" [innerHTML]="content" *ngIf="content"></div>
			<div class="buttons">
				<button class="btn btn-default" (click)="cancelTap()">{{cancelText}}</button>
				<button class="btn btn-default" (click)="okTap()">{{okText}}</button>
			</div>
		</div>
    </div>
	`
})
export class ConfirmComponent implements OnInit {
	constructor(
		private sanitizer: Sanitizer,
		private changeDetectorRef: ChangeDetectorRef,
		private domSanitizer: DomSanitizer
	) { }

	title: string;
	content: string;
	visible: boolean = false;
	okText: string;
	cancelText: string;

	ngOnInit() { }

	promiseWrapper(fn: () => any): Promise<any> {
		return new Promise((resolve, reject) => {
			let maybe_promise;
			if (typeof fn == "function") {
				maybe_promise = fn();
			} else {
				maybe_promise = undefined;
			}
			if (typeof maybe_promise == "undefined") {
				resolve();
			} else if (typeof maybe_promise == "boolean" && maybe_promise) {
				resolve();
			} else if (maybe_promise instanceof Promise) {
				resolve();
			} else {
				reject();
			}
		});
	}

	okTap() { }
	cancelTap() { }
	/**
	 * 设置并显示内容
	 */
	show(config: {
		/**标题 */
		title: string;
		/**正文 */
		content?: string;
		okText?: string;
		okClick?: () => boolean | Promise<any>;
		cancelText?: string;
		cancelClick?: () => boolean | Promise<any>;
	}): Promise<any> {
		return new Promise((resolve, reject) => {

			this.title = config.title;
			// config.content && (this.content = this.sanitizer.sanitize(SecurityContext.HTML, config.content));
			config.content && (this.content = this.domSanitizer.bypassSecurityTrustHtml(config.content) as string);
			this.okText = config.okText || "确定";
			// config.okClick &&
			(this.okTap = () => {
				this.promiseWrapper(config.okClick).then(() => {
					resolve();
					this.close();
				});
			});
			this.cancelText = config.cancelText || "取消";
			// config.cancelClick &&
			(this.cancelTap = () => {
				this.promiseWrapper(config.cancelClick).then(() => {
					reject();
					this.close();
				});
			});
			this.changeDetectorRef.detectChanges();

		});
	}

	/**
	 * 关闭
	 */
	close() { }

}
