import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DateStringfyProvider } from "common/pipe/DateStringfy";

/**
 * 返回日期字符串
 * {{ b | tDuration:[a]}}
 */
@Pipe({
	name: "tDuration"
})
export class Duration implements PipeTransform {

	constructor(
		private dsProvider: DateStringfyProvider
	) { }

	private datePipe = new DatePipe("en-us");
	transform(value: string, args: string | string[]): string {
		if (!(args instanceof Array)) {
			args = [args]
		}
		let count = - new Date(this.datePipe.transform(value, "y/MM/dd HH:mm:ss")).valueOf() + new Date(this.datePipe.transform(args[0] || new Date().valueOf(), "y/MM/dd HH:mm:ss")).valueOf();
		let countResult = this.dsProvider.toCount(count/1000);
		console.log(value,args)
		if (!args[1]) {
			if (countResult.second) {
				countResult.minute += 1;
				countResult.second = 0;
			}
			if (countResult.minute > 59) {
				countResult.hour += 1;
				countResult.minute = 0;
			}
			if (countResult.hour > 23) {
				countResult.hour = 0;
				countResult.day += 1;
			}
		}

		let str = [];
		if (countResult.day) {
			str.push(countResult.day + "天");
		}
		if (countResult.hour) {
			str.push(countResult.hour + "小时");
		}
		if (countResult.minute) {
			str.push(countResult.minute + "分钟");
		}
		if (countResult.second) {
			str.push(countResult.second + "秒");
		}

		return str.join("");
	}
}
