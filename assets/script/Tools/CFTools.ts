import Singleton from "../Base/Singleton";

export default class CFTools extends Singleton {
    /** 是否开启  Log 信息 */
    private static isLog = true;
    private static logName: string = "CocosFrameworkLog:"

    /** 普通log信息 */
    public static log(...data: any[]): void {
        if (!this.isLog) { return; }
        console.log(this.logName, ...data);
    }
    /** 追踪函数调用的log */
    public static logTrace(...data: any[]) {
        if (!this.isLog) { return; }
        console.trace(this.logName, ...data);
    }
    /** 打印错误log信息 */
    public static error(...data: any[]): void {
        if (!this.isLog) { return; }
        console.error(this.logName, ...data);
    }
    /** 打印警告log信息 */
    public static warn(...data: any[]): void {
        if (!this.isLog) { return; }
        console.warn(this.logName, ...data);
    }
}
