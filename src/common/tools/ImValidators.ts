import { Directive, forwardRef, Attribute, Input, Injector, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ServerProvider } from "./../providers/ServerProvider";
import { UtilProvider } from "./../providers/UtilProvider";
import { StorageProvider } from "./../providers/StorageProvider";

@Injectable()
export class ImValidators {
	constructor(
		private serverProvider: ServerProvider,
	) { }

	static min(min: number, hint?: string) {
		return (control: AbstractControl): {
			[key: string]: boolean | string;
		} => {
			if (control.value > min) {
				return null;
			} else {
				return { min: hint || "不能小于" + min }
			}
		}
	}

	static max(max: number, hint?: string) {
		return (control: AbstractControl): {
			[key: string]: boolean | string;
		} => {
			if (control.value < max) {
				return null;
			} else {
				return { max: hint || "不能超过" + max }
			}
		}
	}

	static pattern(regexp: RegExp, hint: string) {
		return (control: AbstractControl): {
			[key: string]: boolean | string;
		} => {
			if (regexp.test(control.value)) {
				return null;
			} else {
				return { pattern: hint || false }
			}
		}
	}
	static isInteger(control: AbstractControl): {
		[key: string]: boolean;
	} {
		let value = control.value + "";
		if (value && (value.match(/^\+?[1-9][0-9]*$/) || value.match(/^[0-9]*[1-9][0-9]*$/) || value.match(/^[0]$/))) {
			return null;
		}
		return { interger: false };
	};

	static isDecimal(control: AbstractControl): {
		[key: string]: boolean;
	} {
		let value = control.value + "";
		if (value && (value.match(/^(-?\d+)(\.\d+)?$ 或 ^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/))) {
			return null;
		}
		return { decimal: false };
	};

	static isNumber(control: AbstractControl): {
		[key: string]: boolean;
	} {
		let value = control.value.toString();
		let number = parseFloat(value);
		if (value == number) {
			return null;
		}
		return { number: false };
	};

	isInterger = ImValidators.isInteger;
	isDecimal = ImValidators.isDecimal;

	isUnique(config: {
		url: string;
		idValue: string | number;
		idName: string;
		fieldName: string;
		fieldValue: string | number;
		parent: string | number;
	}) {
		let timer, cancel;
		return (control: AbstractControl): Promise<{
			[key: string]: boolean;
		}> => {
			return new Promise((resolve, reject) => {
				timer && clearTimeout(timer);
				cancel && cancel();
				cancel = () => {
					resolve({ unique: false });
				};
				timer = setTimeout(() => {
					this.serverProvider.get(config.url, {
						params: {
							value: control.value,
							fieldName: config.fieldName || "",
							fieldValue: config.fieldValue || "",
							idName: config.idName || "",
							idValue: config.idValue || "",
						}
					}).then(resp => {
						resp.data ? resolve(null) : resolve({ unique: false });
					}, () => {
						resolve({ unique: false });
					})
				}, 500);
			});
		}
	}

}