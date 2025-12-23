import Singleton from "../Base/Singleton";
import { SaveTime } from "../GameDefine/GameDefine";
import { StorageManager } from "../GameManager/StorageManager";
import { CFTools } from "./CFTools";

export default class Energy extends Singleton {

    /** 默认体力上限为5 */
    public energyNum: number = 5;
    /** 体力下次恢复的时间 */
    public nextRecoveryTime: number = null;
    /** 用于保存定时器 */
    private recoveryTimer: number | null = null;

    private timeStorageName: string = "TimeStorage";


    public initTime(): void {
        let data: string | SaveTime = StorageManager.getStorage(this.timeStorageName);
        CFTools.log(data)
        if (!data) {
            // 表明没有数据，体力值应为满的状态
            this.energyNum = 5;
        } else {
            data = JSON.parse(data) as SaveTime;

            // 判断还离下一个恢复节点还有多长时间
            let currentTime: number = new Date().getTime();
            let remainTime: number = currentTime - data.time;
            if (remainTime > 0) {
                // 说明下一个节点已经恢复完毕
                this.energyNum = data.currentEnergyNum++;
                // 还是没有到达上限，继续检测剩余时间
                while (this.energyNum < 5 && remainTime > 0) {
                    if (remainTime - 5 * 1000 > 0) {
                        this.energyNum++;
                        remainTime -= 5 * 1000;
                    }
                }

                if (this.energyNum < 5) {
                    CFTools.log(`体力没有恢复满，当前体力值为${this.energyNum}，还需要${Math.abs(remainTime / 1000)}秒`);
                    StorageManager.setStorage(this.timeStorageName, JSON.stringify({ time: Math.abs(remainTime), currentEnergyNum: this.energyNum }));
                } else {
                    CFTools.log(`体力已经恢复完毕`);
                    StorageManager.removeItem(this.timeStorageName);
                }

                // 继续倒计时
                this.recoveryEnergy(Math.floor(Math.abs(remainTime / 1000)));
            } else {
                this.energyNum = data.currentEnergyNum;
                // 下一个节点还未恢复完毕
                if (this.energyNum < 5) {
                    CFTools.log(`体力没有恢复满，当前体力值为${this.energyNum}，还需要${Math.abs(remainTime / 1000)}秒`);
                    StorageManager.setStorage(this.timeStorageName, JSON.stringify({ time: Math.abs(remainTime), currentEnergyNum: this.energyNum }));
                } else {
                    CFTools.log(`体力已经恢复完毕`);
                    StorageManager.removeItem(this.timeStorageName);
                }

                // 继续倒计时
                this.recoveryEnergy(Math.floor(Math.abs(remainTime / 1000)));
            }
        }
    }

    /**
     * 减少体力值
     * @returns 是否减少体力成功
     */
    public reduceEnergy(): boolean {
        if (this.energyNum <= 0) {
            CFTools.log("已经没有体力了");
            return false;
        } else {
            this.energyNum--;
            // 开启倒计时
            if (this.recoveryTimer == null) {
                this.recoveryEnergy();
            }

            return true;
        }
    }

    /**
     * 增加体力
     */
    public addEnergy(): false {
        if (this.energyNum >= 5) {
            CFTools.log("体力达到上限");
            return false;
        } else {
            this.energyNum++;
        }
    }

    /** 恢复体力的倒计时计算 */
    public recoveryEnergy(remainTime: number = 5): void {
        this.nextRecoveryTime = remainTime;
        // 记录下次恢复满体力的时间
        let recoveryTime: number = new Date().getTime() + this.nextRecoveryTime * 1000;
        // 存到存储当中
        StorageManager.setStorage(this.timeStorageName, JSON.stringify({ time: recoveryTime, currentEnergyNum: this.energyNum }));
        this.recoveryTimer = setInterval(() => {
            this.nextRecoveryTime--;
            CFTools.log(this.nextRecoveryTime);
            if (this.nextRecoveryTime <= 0) {
                this.energyNum++;
                if (this.energyNum == 5) {
                    clearInterval(this.recoveryTimer);
                    this.recoveryTimer = null;
                    // 清空存储
                    StorageManager.removeItem(this.timeStorageName);
                } else if (this.energyNum < 5) {
                    this.nextRecoveryTime = 5;
                }
            }
            // 同步更新label
            // EventManager.dispatchEvent(GameEvent.UPDATE_TIME_COUNTDOWN);
        }, 1000);
    }
}