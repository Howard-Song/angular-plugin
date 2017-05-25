import { DateRangeType, DateRangeType_Helper } from "./../../enums/DateRangeType";

export class DateRange {
	type: DateRangeType;
	start: Date;
	end: Date;
}

export class DateRangeHandler {
	private days = [];
	private months = [];
	private years = [];
	private weeks = [];

	makeList() {
		let drt = new DateRangeType_Helper;
		for (let key in drt.valueIndex) {
			if (key.match(/^1/)) {
				this.days.push({
					value: key,
					text: drt.valueIndex[key]
				});
			} else if (key.match(/^2/)) {
				this.months.push({
					value: key,
					text: drt.valueIndex[key]
				});
			} else if (key.match(/^3/)) {
				this.years.push({
					value: key,
					text: drt.valueIndex[key]
				});
			} else if (key.match(/^4/)) {
				this.weeks.push({
					value: key,
					text: drt.valueIndex[key]
				});
			}
		}
		return {
			days: this.days,
			months: this.months,
			years: this.years,
			weeks: this.weeks
		}
	}
}