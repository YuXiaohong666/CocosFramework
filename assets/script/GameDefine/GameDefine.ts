import Singleton from "../Base/Singleton";
import MainGame from "../GameScene/MainGame";

export class GameDefine extends Singleton {
    public static get _ins(): GameDefine {
        return this.getInstance();
    }

    colorArr: Array<string> = [
        "#915743",
        "#FDF845",
        "#FF5655",
        "#F654AE",
        "#5C9DF9",
        "#BD57FF",
        "#B6F637",
        "#23E0FA",
        "#FF9D45",
        "#D9D9D9"
    ]

    mainGame: MainGame;
    isDebug: boolean = false;
}

export interface SaveTime {
    time: number
    currentEnergyNum: number
}
