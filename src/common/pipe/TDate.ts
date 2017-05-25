import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

/**
 * 返回日期字符串
 */
@Pipe({
	name: "tDate"
})
export class TDate implements PipeTransform {
	private datePipe = new DatePipe("en-us");
	transform(value: string, args: string | string[]): string {
		return this.datePipe.transform(value, "y-MM-dd");
	}
}

/**
 * 返回到分钟的日期字符串
 */
@Pipe({
	name: "tDateTime"
})
export class TDateTime implements PipeTransform {
	private datePipe = new DatePipe("en-us");

	transform(value: string, args: string | string[]): string {
		//console.log(this.datePipe.transform(value, "y-MM-dd HH:mm"))
		return this.datePipe.transform(value, "y-MM-dd HH:mm");
	}
}
/**
 * 返回到分钟的日期字符串
 */
@Pipe({
	name: "tFullDateTime"
})
export class TFullDateTime implements PipeTransform {
	private datePipe = new DatePipe("en-us");

	transform(value: string, args: string | string[]): string {
		//console.log(this.datePipe.transform(value, "y-MM-dd HH:mm"))
		return this.datePipe.transform(value, "y-MM-dd HH:mm:ss");
	}
}