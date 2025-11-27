/**
 * 单例模式
 */
export default class Singleton {
    protected static _instance: any = null;
    public static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }

    public static destroyInstance(): void {
        (<any>this).instance = null;
    }
}
