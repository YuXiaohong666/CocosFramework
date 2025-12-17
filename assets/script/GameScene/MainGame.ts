import { GameData } from "../GameData/GameData";
import { GameDefine } from "../GameDefine/GameDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainGame extends cc.Component {

    onLoad() {
        GameData.getInstance().initData();
        GameDefine.getInstance().mainGame = this;
    }

    start() {

    }

    // update (dt) {}
}
