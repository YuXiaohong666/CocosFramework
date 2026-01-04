import { UIManager } from "../GameManager/UIManager";
import { CFTools } from "../Tools/CFTools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewBase extends cc.Component {

    /** UI面板点击关闭按钮的操作，注意节点名需要和脚本名一致 */
    clickCloseBtn(): void {
        UIManager.CloseUI(this.node.name);
    }

    /** 打开UI时进行的操作，可以初始化数据，也可以设计打开动画，还可以携带参数 */
    openUI(): void {
        CFTools.log("test");
    }

    /** 关闭UI时的操作，默认为直接销毁节点 */
    closeUI(isDestroy: boolean = false): void {
        if (isDestroy) {
            this.node.destroy();
        } else {
            this.node.removeFromParent();
        }
    }
}
