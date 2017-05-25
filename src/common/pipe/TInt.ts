import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";

/**
 * 返回格式化金额数字
 */
@Pipe({
	name: "tInt"
})
export class TInt implements PipeTransform {
	private numberic = new DecimalPipe("en-us");

	transform(value: string, args: string | string[]): string {
		if (value)
			return this.numberic.transform(value, "1.0-0");
		else return "";
	}
}