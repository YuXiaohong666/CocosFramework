import Singleton from "../Base/Singleton";
export class GameData extends Singleton {
    public level: number = 10;
}

window['gameData'] = GameData._ins;