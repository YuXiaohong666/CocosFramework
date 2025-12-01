import Singleton from "../Base/Singleton";

export enum GameEvent {
    // 在此处定义事件名
    Replay = "Replay"
}

export default class EventManager extends Singleton {
    /**
     * 添加一个全局监听
     * @param eventName 事件名
     * @param callback 事件Function
     * @param target 添加监听事件的脚本this
    */
    public static addListener(eventName: string, callback: Function, target: any) {
        cc.director.on(eventName, callback, target);
    };
    /**
     * 移除一个监听事件
     * @param {*} eventName 事件名
     * @param {*} callback 事件Function
     * @param {*} target 添加监听事件的Node
     */
    public static removeListener(eventName: string, callback: Function, target: any) {
        cc.director.off(eventName, callback, target);
    };
    /**
     * 派发一个事件   令所有监听此事件的Node执行事件
     * @param {*} eventName 事件名
     * @param {*} arg1 传递的参数1
     * @param {*} arg2 传递的参数2
     * @param {*} arg3 传递的参数3
     * @param {*} arg4 传递的参数4
     * @param {*} arg5 传递的参数5
     */
    public static dispatchEvent(eventName: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) {
        cc.director.emit(eventName, arg1, arg2, arg3, arg4, arg5);
    };
    /**
     * 移除 Node 上的所有事件
     * @param {*} target 需要移除事件的Node
     */
    public static removeListenerForTarget(target: any) {
        cc.director.targetOff(target);
    };
}
