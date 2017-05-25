export class ResponseData {
    public static SessionKeyName = "__sk";
    public static Cookie = "Cookie";
    public static SessionIDName = "JSSID";
    public static Code_OK = 0;
    public static Code_error = -1;
    public static Code_confirm = -2;
    public static Code_fatal = -3;
    public static Code_Login = -4;
    public static Code_Hint = -5;
    public static Code_needCode = -6;
    code: number;
    msg: string;
    data: any;
    exData: any;
}