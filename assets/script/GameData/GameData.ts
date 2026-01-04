import Singleton from "../Base/Singleton";
import { StorageManager } from "../GameManager/StorageManager";
import { Tools } from "../Tools/Tools";
export class GameData extends Singleton {
    // 数据存储键名（在此处替换为游戏名，防止存档冲突）
    private storageName: string = "GameName_GameData";
    /** 当前关卡数 */
    public level: number = 1;
    /** 音乐开关 */
    public musicSwitcher: boolean = true;
    /** 音效开关 */
    public effectSwitcher: boolean = true;
    /** 今日 */
    public currentDay: string = Tools.getDateStr();

    public static get _ins(): GameData {
        return this.getInstance();
    }



    /**
     * 切换音乐开关状态
     * 
     * @returns {void} 无返回值
     * 
     * 该函数用于切换音乐的开启/关闭状态，并更新相关数据。
     * 主要功能包括：
     * 1. 反转音乐开关的状态
     * 2. 调用数据设置方法保存更改
     */
    switchMusic(): void {
        this.musicSwitcher = !this.musicSwitcher;
        this.setData();
    }

    /**
     * 切换效果开关状态
     * 
     * @description 该函数用于切换音效的开启/关闭状态，并更新相关数据。
     * @returns {void} 无返回值
     */
    switchEffect(): void {
        // 切换效果开关状态
        this.effectSwitcher = !this.effectSwitcher;
        // 更新数据
        this.setData()
    }

    /**
     * 从本地缓存中初始化游戏数据
     */
    initData(): void {
        this.level = JSON.parse(StorageManager.getStorage(this.storageName))?.level ?? 1;
        this.musicSwitcher = JSON.parse(StorageManager.getStorage(this.storageName))?.musicSwitcher ?? true;
        this.effectSwitcher = JSON.parse(StorageManager.getStorage(this.storageName))?.effectSwitcher ?? true;
        this.currentDay = JSON.parse(StorageManager.getStorage(this.storageName))?.currentDay ?? Tools.getDateStr();

        // 检查今天是不是新的一天
        if (Tools.getDateStr() != this.currentDay) {
            this.currentDay = Tools.getDateStr();
        }

        this.setData();
    }

    /**
     * 存储游戏数据
     */
    setData(): void {
        let gameData = {
            level: this.level,
            musicSwitcher: this.musicSwitcher,
            effectSwitcher: this.effectSwitcher,
            currentDay: this.currentDay
        }
        StorageManager.setStorage(this.storageName, JSON.stringify(gameData));
    }
}

window['gameData'] = GameData.getInstance();