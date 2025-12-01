import Singleton from "../Base/Singleton";
import CFTools from "../Tools/CFTools";
import { Tools } from "../Tools/Tools";

export class PoolManager extends Singleton {
    private static PoolDic: Map<string, Node> = new Map();//存放所有对象池  字典
    /**
     * 把Node添加到对象池中
     * @param {*} Obj 存放的Node
     */
    public static addPoolObj(Obj: cc.Node) {
        if (this.PoolDic[Obj.name] == null) {
            this.PoolDic[Obj.name] = new cc.NodePool(Obj.name);
        }
        this.PoolDic[Obj.name].put(Obj)
    };
    /**
     * 从对象池中取出Node
     * @param {} poolName 对象池名字
     */
    public static getPoolObj(poolName: string) {
        if (this.PoolDic[poolName] == null) {
            CFTools.warn("没有添加对象池：", poolName);
            this.PoolDic[poolName] = new cc.NodePool(poolName);
            return Tools.newPrefab(poolName);
            // return null;
        }
        if (this.PoolDic[poolName].size() > 1) {
            return this.PoolDic[poolName].get();
        } else {
            return Tools.newPrefab(poolName);
            // return null;
        }
    };
    /**
    * 清除掉一个池子
    * @param {} poolName 对象池名字
    */
    public static clearPool(poolName: string) {
        if (this.PoolDic[poolName] == null) {
            CFTools.warn("没有添加对象池：", poolName);
            return;
        }
        return this.PoolDic[poolName].clear();
    };
    /** 清除所有池子 */
    public static clearAllPool() {
        for (const key in this.PoolDic) {
            if (Object.prototype.hasOwnProperty.call(this.PoolDic, key)) {
                this.clearPool(key);
            }
        }
    };
}