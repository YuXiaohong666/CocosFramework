/**
 * 单例模式基类
 */
export default class Singleton {
    private static _instance: any = null;
    public constructor() { }
    public static get _ins() {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }
}
