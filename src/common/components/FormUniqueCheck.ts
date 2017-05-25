import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ServerProvider } from "./../providers/ServerProvider";

/**
 * 字段唯一性检测
 */

@Directive({
	selector: '[unique][formControlName],[unique][formControl],[unique][ngModel]',
	providers: [
		{ provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UniqueValidator), multi: true }
	]
})
export class UniqueValidator implements Validator {
	constructor(
		@Attribute('unique') public unique: string,
		private serverProvider: ServerProvider
	) { }

	@Input() fieldName: string;
	@Input() fieldValue: string;
	@Input() idName: string;
	@Input() idValue: string;
	/**
	 * 表示验证的网址
	 */
	@Input() url: string;
	/**
	 * 附加条件
	 */
	@Input() cond: string;
	@Input() parentValue: string;

	timer: NodeJS.Timer;
	cancel: () => void;
	validate(c: AbstractControl): Promise<{ [key: string]: any }> {
		return new Promise((resolve, reject) => {
			this.timer && clearTimeout(this.timer);
			this.cancel && this.cancel();
			this.cancel = () => {
				resolve({ unique: false });
			};
			this.timer = setTimeout(() => {
				this.serverProvider.get(this.url, {
					params: {
						// value: c.value,
						fieldName: this.fieldName || "",
						fieldValue: c.value || "",
						// idName: this.idName || "",
						idValue: this.idValue || "",
					}
				}).then(resp => {
					resp.data ? resolve({ unique: false }) : resolve(null);
				}, () => {
					resolve({ unique: false });
				})
			}, 500);
		});
	}
} 