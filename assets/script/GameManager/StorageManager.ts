
export default class StorageManager {

    /**
     * 获取本地缓存
     * @param key 缓存名
     * @param defaultValue 若无值则使用缺省值覆盖
     * @returns 
     */
    public static getStorage(key: string, defaultValue?: string): string {
        let value: string = cc.sys.localStorage.getItem(key);
        if (value == null && defaultValue) {
            return defaultValue;
        }
        return value;
    }

    /**
     * 储存数据
     * @param key 缓存名
     * @param value 要缓存的值
     */
    public static setStorage(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
    }

    /**
     * 移除指定的缓存
     * @param key 要清除的缓存名
     */
    public static removeItem(key: string): void {
        cc.sys.localStorage.removeItem(key);
    }

    /**
     * 移除所有的本地缓存
     */
    public static clearStorage(): void {
        cc.sys.localStorage.clear();
    }
}
