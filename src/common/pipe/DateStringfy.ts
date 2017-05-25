import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
@Injectable()
export class DateStringfyProvider {
    private datePipe = new DatePipe("en-us");
    /**
     * time:number 单位秒
     */
    toCount(number: number) {
        //秒
        let second = Math.floor(number % 60);
        //分
        let minute = Math.floor((number - second) / 60 % 60);
        //时
        let hour = Math.floor((number - second - minute * 60) / (60 * 60) % 24);
        //天
        let day = Math.floor((number - second - minute * 60 - hour * 60 * 60) / (60 * 60 * 24));
        return {
            day: day,
            second: second,
            hour: hour,
            minute: minute
        }
    }
    baseCount(number: number): string {
        //秒
        let second = Math.floor(number % 60);
        //分
        let minute = Math.floor((number - second) / 60 % 60);
        //时
        let hour = Math.floor((number - second - minute * 60) / (60 * 60) % 24);
        //天
        let day = Math.floor((number - second - minute * 60 - hour * 60 * 60) / (60 * 60 * 24));
        if (day) {
            return day + "天" + hour + "小时" + minute + "分钟" + second + "秒";
        } else if (hour) {
            return hour + "小时" + minute + "分钟" + second + "秒";
        } else if (minute) {
            return minute + "分钟" + second + "秒";
        } else if (second) {
            return second + "秒";
        }
    }
    baseDate(raw: any, useDefault: boolean = true): Date {
        let date;
        useDefault && (date = new Date());
        if (parseInt(raw) == raw) {
            if ((raw + "").length == 10) {
                date = new Date(parseInt(raw + "000"));
            } else if ((raw + "").length == 13) {
                date = new Date(parseInt(raw));
            } else {
                console.warn("无效的日期格式");
            }
        } else {
            let r = new Date(raw);
            if (r.valueOf()) {
                date = r;
            } else {
                console.warn("无效的日期格式");
            }
        }
        return date;
    }
    fromTimeValue(time: number): string {
        return this.baseCount(time / 1000);
    }
    date(raw: any, divider: string = "-", useDefault: boolean = true) {
        let date = this.baseDate(raw, useDefault);
        return date && date.getFullYear() + divider + this.fillStr((date.getMonth() + 1)) + divider + this.fillStr(date.getDate());
    }
    private fillStr(str: string | number, addTo: number = 2) {
        let _str = str + "";
        for (let i = _str.length; i < addTo; i++) {
            _str = "0" + _str;
        }
        return _str;
    }
    pipe(date: string | number | Date, format?: string) {
        let str = "";
        try {
            str = this.datePipe.transform(date, format);
        } catch (e) { }
        return str;
    }
}

@Pipe({
    name: "DateStringfy"
})
export class DateStringfy implements PipeTransform {
    constructor(
        private DateStringfyProvider: DateStringfyProvider
    ) { }

    transform(value: string, args: string | string[]): string {
        if (typeof args == "string") {
            args = [args];
        }
        if (typeof value == "string") {
            value = value.replace(/-/g, "/");
        }
        //将时间转换为时间数字,如果传入时间字符串不能转换,则默认当前时间;
        let raw = new Date(value).valueOf() || new Date().valueOf();
        let now = new Date().valueOf();
        let count = () => {
            //时间差,初始为0
            let different = 0;
            let decorate = args[1];
            if (raw >= now) {
                different = raw - now;
            } else {
                different = now - raw;
                return (decorate || "") + this.DateStringfyProvider.fromTimeValue(different);
            }
            return this.DateStringfyProvider.fromTimeValue(different);
        }
        let differ = () => {
            //时间差,初始为0
            let different = 0;
            let differTime = this.DateStringfyProvider.baseDate(args[1]).valueOf();
            if (raw >= differTime) {
                different = raw - differTime;
            } else {
                different = differTime - raw;
                return this.DateStringfyProvider.fromTimeValue(different);
            }
            return this.DateStringfyProvider.fromTimeValue(different);
        }
        switch (args[0]) {
            case "count":
                return count();
            case "differ":
                return differ();
        }
    }
}