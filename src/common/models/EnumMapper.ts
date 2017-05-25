export class EnumMapper {
	private static mapperList: {
		[index: string]: EnumMapper;
	};
	constructor(public title: string, public valueIndex: any, public textIndex: any) {
	}
	getTextByValue(num: number): string {
		return this.valueIndex[num];
	}
	getValueByText(text: string): string {
		return this.textIndex[text];
	}
	public static register(mapper: any[]): void {
		if (!EnumMapper.mapperList) {
			EnumMapper.mapperList = {};
			mapper.map(helper => {
				EnumMapper.mapperList[helper.helperName] = helper;
			})
		}
	}
	public static getHelper(type: string): EnumMapper {
		if ((EnumMapper.mapperList[type + "_Helper"] as any)) {
			return new (EnumMapper.mapperList[type + "_Helper"] as any)();
		}
	}
}