import StorageManager from "../GameManager/StorageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainGame extends cc.Component {

    // onLoad () {}

    start() {
        console.log(StorageManager.getStorage("123"));

    }

    // update (dt) {}
}
