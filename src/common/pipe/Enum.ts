import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { ServerProvider } from "./../providers/ServerProvider";
import { EnumHelpers } from "./../models/EnumHelpers";
import { EnumMapper } from "./../models/EnumMapper";

/**
 * 
 * 将id值通过请求转换为可读内容
 * 
 * {{691 | Enum:"EnumName" }}
 * 
 */

@Pipe({
	name: "Enum"
})
export class Enum implements PipeTransform {
	enumHelper;
	constructor() {
		EnumMapper.register(EnumHelpers.list);
	}

	transform(value: string, args: string) {
		if (args) {
			this.enumHelper = EnumMapper.getHelper(args);
			return this.enumHelper.valueIndex[value];
		} else {
			return "";
		}
	}
}