import { Component, OnInit, Sanitizer, SecurityContext, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'toast-overlay',
	template: `
	<div class="toast-container" *ngIf="visible" [ngClass]="{'has-button':showButton,'has-title':title}">
		<div class="toast-body" [ngClass]="position">
		<div class="title" *ngIf="title">{{title}}</div>
		<div [innerHTML]="content"></div>
		<button class="btn btn-warning" *ngIf="showButton" (click)="beforeClose();">{{buttonName}}</button>
		</div>
    </div>
	`
})
export class ToastComponent implements OnInit {
	constructor(
		private sanitizer: Sanitizer,
		private changeDetectorRef: ChangeDetectorRef
	) { }
	title: string;
	content: string;
	position: string;
	visible: boolean = false;

	ngOnInit() { }

	/**控制自动关闭 */
	timeout: number = 3000;
	autoClose(timeout?: number) {
		setTimeout(() => {
			this.close();
		}, timeout || this.timeout);
	}

	/**
	 * 按钮回调
	 */
	showButton: boolean;
	buttonName: string = "确定";
	callback() { }

	setContent(content: string) {
		content && (this.content = content);
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * 设置并显示内容
	 */
	show(config: {
		title?: string;
		/**提示文本/html */
		content: string;
		/**提示位置, bottom/middle/top ,默认bottom */
		position?: string;
		/**自动关闭时间,单位毫秒, 默认3000毫秒 */
		timeout?: number;
		/**是否手动关闭,默认false */
		manual?: boolean;
		button?: {
			name: string;
			onclick: () => void;
		}
	}) {
		if (config.content) {
			this.title = config.title;
			this.content = this.sanitizer.sanitize(SecurityContext.HTML, config.content);
			this.position = config.position || "bottom";
			this.visible = true;
			(!config.manual && !config.button) && this.autoClose(config.timeout);
			if (config.button) {
				this.showButton = true;
				config.button.name && (this.buttonName = config.button.name);
				config.button.onclick && (this.callback = config.button.onclick);
			}
			this.changeDetectorRef.detectChanges();
		}
	}

	beforeClose() {
		let callback = this.callback();
		if (typeof callback == "boolean" && callback) {
			this.close();
		} else if (typeof callback == "undefined") {
			this.close();
		} else if (<any>callback instanceof Promise) {
			let q: Promise<any> = <any>callback;
			q.then(() => {
				this.close();
			})
		};
	}

	/**
	 * 关闭
	 */
	close() { }

}
