import Singleton from "../Base/Singleton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameData extends Singleton {
    public level: number;
}
