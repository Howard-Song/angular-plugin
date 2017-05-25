import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { ServerProvider } from "./../providers/ServerProvider";
import { UtilProvider } from "./../providers/UtilProvider";
import { RuntimeDataManage } from "app/app.base/RuntimeDataManage";


/**
 * 
 * 将id值通过请求转换为可读内容
 * 
 * {{691 | IdToName:["url","fieldNames"] | async }}
 * 
 */

// call url: /m/sys/util/id2name
// * tableName表名
// * idName--id字段名
// * idValue--id字段值
// * fieldNames--返回字段名
// * isCache是否需要缓存,默认true
// * isPullAll是否需要全表,默认true

@Pipe({
	name: "IdToName"
})
export class IdToName implements PipeTransform {
	static DataManage = new RuntimeDataManage("__id2name__")
	constructor(
		private serverProvider: ServerProvider,
		private utilProvider: UtilProvider,
	) { }

	makeKey(url, params) {
		let arr = [];
		params = this.utilProvider.extend(params, this.utilProvider.parseUrlSearch(url));
		for (let key in params) {
			arr.push(key = params[key]);
		}
		return url + "?" + arr.join("&");
	}

	transform(value: string, args: string | string[]): Promise<any> {
		let splitStr = " ";
		let fieldNames = args[1].split(/[,/|、]/gi);
		let newField = [];
		fieldNames.map(name => {
			if (name) {
				newField.push(name);
			}
		});
		return new Promise((resolve, reject) => {
			let key = this.makeKey(args[0], {
				id: value,
				fieldNames: newField.join(",")
			});
			if (value) {
				let preData;
				if (preData = IdToName.DataManage.get(key)) {
					if (preData)
						resolve((() => {
							let readyStr = [];
							newField.map(key => {
								if (preData[key]) {
									readyStr.push(preData[key]);
								}
							})
							return readyStr.join(splitStr);
						})());
					else
						resolve("");
				} else {
					this.serverProvider.get(args[0], {
						params: {
							id: value,
							fieldNames: newField.join(",")
						}
					}).then(resp => {
						if (resp.data) {
							resolve((() => {
								let readyStr = [];
								newField.map(key => {
									if (resp.data[key]) {
										readyStr.push(resp.data[key]);
									}
								})
								return readyStr.join(splitStr);
							})());
							IdToName.DataManage.set(key, resp.data);
						}
					}, () => {
						resolve("");
						IdToName.DataManage.set(key, "");
					})
				}
			} else {
				resolve("");
				IdToName.DataManage.set(key, "");
			}
		});
	}
}