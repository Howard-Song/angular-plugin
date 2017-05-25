import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";

/**
 * 返回格式化金额数字
 */
@Pipe({
	name: "tMoney"
})
export class TMoney implements PipeTransform {
	private numberic = new DecimalPipe("en-us");

	transform(value: string, args: string | string[]): string {
		if (parseInt(value) != NaN) {
			return this.numberic.transform(value, "1.2-2");
		} else
			return "";
	}
}