/**
 * 
 */
import { ResManager } from "../GameManager/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property({
        tooltip: '最小加载时间（秒）'
    })
    minLoadTime: number = 2.0;

    @property({
        tooltip: '最大加载时间（秒）'
    })
    maxLoadTime: number = 4.0;

    @property({
        tooltip: '是否在加载完成后自动隐藏'
    })
    autoHide: boolean = true;

    @property(cc.Node)
    contentNode: cc.Node = null;

    @property({
        tooltip: '是否模拟网络波动（进度会偶尔回退）'
    })
    simulateNetworkFluctuation: boolean = true;

    @property({
        tooltip: '是否在95%时卡住模拟最后加载阶段'
    })
    stuckAt95Percent: boolean = true;

    @property({
        tooltip: '进度条填充速度'
    })
    fillSpeed: number = 1.5;

    // 私有属性
    private currentProgress: number = 0;
    private targetProgress: number = 0;
    private isLoading: boolean = false;
    private loadTime: number = 0;
    private totalLoadTime: number = 0;
    private stage: number = 0; // 加载阶段：0=开始，1=第一阶段，2=第二阶段，3=95%卡住，4=完成

    onLoad() {
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.isLoading = false;
        this.loadTime = 0;
        this.stage = 0;

        // 初始化进度条
        if (this.progressBar) {
            this.progressBar.progress = 0;
        }

        // 初始化文本
        if (this.progressLabel) {
            this.progressLabel.string = "0%";
        }

        // 隐藏内容节点
        if (this.contentNode) {
            this.contentNode.active = false;
        }
    }

    start() {
        this.startLoading();
    }

    /**
     * 开始加载
     */
    startLoading(): void {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.loadTime = 0;
        this.stage = 0;

        // 随机加载时间
        this.totalLoadTime = cc.misc.lerp(
            this.minLoadTime,
            this.maxLoadTime,
            Math.random()
        );

        // 开始更新进度
        this.schedule(this.updateProgress, 0.02);

        // 模拟加载过程
        this.simulateLoadingProcess();
    }

    /**
     * 模拟加载过程
     */
    private simulateLoadingProcess(): void {
        // 第一阶段：快速加载到40%
        this.stage = 1;
        this.targetProgress = 0.4;

        this.scheduleOnce(() => {
            // 第二阶段：中速加载到80%
            this.stage = 2;
            this.targetProgress = 0.8;

            // 模拟网络波动
            if (this.simulateNetworkFluctuation) {
                this.scheduleOnce(() => {
                    // 模拟一次网络波动，进度回退
                    const fluctuationAmount = 0.1 + Math.random() * 0.1;
                    this.targetProgress = Math.max(0.6, this.targetProgress - fluctuationAmount);

                    // 0.5秒后恢复
                    this.scheduleOnce(() => {
                        this.targetProgress = 0.8;
                    }, 0.5);
                }, 0.8);
            }

            this.scheduleOnce(() => {
                // 第三阶段：慢速加载到95%
                this.stage = 3;
                this.targetProgress = 0.95;

                // 是否在95%卡住
                if (this.stuckAt95Percent) {
                    this.scheduleOnce(() => {
                        // 完成加载
                        this.stage = 4;
                        this.targetProgress = 1.0;

                        // 加载完成回调
                        this.scheduleOnce(() => {
                            this.onLoadComplete();
                        }, 0.3);
                    }, 0.8 + Math.random() * 0.5); // 随机卡住时间
                } else {
                    this.scheduleOnce(() => {
                        // 完成加载
                        this.stage = 4;
                        this.targetProgress = 1.0;

                        this.scheduleOnce(() => {
                            this.onLoadComplete();
                        }, 0.3);
                    }, 0.5);
                }
            }, 0.8);

        }, this.totalLoadTime * 0.3);
    }

    /**
     * 更新进度
     */
    private updateProgress(): void {
        if (!this.isLoading) return;

        this.loadTime += 0.02;

        // 根据阶段调整填充速度
        let speed = this.fillSpeed;
        switch (this.stage) {
            case 1: // 第一阶段：快速
                speed = this.fillSpeed * 1.5;
                break;
            case 2: // 第二阶段：中速
                speed = this.fillSpeed;
                break;
            case 3: // 第三阶段：慢速
                speed = this.fillSpeed * 0.6;
                break;
            case 4: // 完成阶段：快速到100%
                speed = this.fillSpeed * 2;
                break;
        }

        // 平滑插值到目标进度
        this.currentProgress = cc.misc.lerp(
            this.currentProgress,
            this.targetProgress,
            speed * 0.02
        );

        // 更新进度条
        if (this.progressBar) {
            this.progressBar.progress = Math.min(this.currentProgress, 1);
        }

        // 更新文本显示
        if (this.progressLabel) {
            const percent = Math.floor(this.currentProgress * 100);
            this.progressLabel.string = `${Math.min(percent, 100)}%`;
        }
    }

    /**
     * 加载完成
     */
    private onLoadComplete(): void {
        this.isLoading = false;
        this.currentProgress = 1;

        // 确保进度显示为100%
        if (this.progressBar) {
            this.progressBar.progress = 1;
        }
        if (this.progressLabel) {
            this.progressLabel.string = "100%";
        }

        // 显示内容
        if (this.contentNode) {
            this.contentNode.active = true;
        }

        // 触发完成事件
        this.node.emit('load-complete');

        // 自动隐藏
        if (this.autoHide) {
            this.scheduleOnce(() => {
                this.node.active = false;
            }, 0.5);
        }

        // 切换场景
        ResManager.loadScene("HomeScene", () => {

        })
    }

    /**
     * 重新开始加载
     */
    restart(): void {
        this.unscheduleAllCallbacks();
        this.node.active = true;

        // 隐藏内容节点
        if (this.contentNode) {
            this.contentNode.active = false;
        }

        this.startLoading();
    }

    /**
     * 手动设置进度（用于真实加载时）
     * @param progress 进度值 0-1
     */
    setProgress(progress: number): void {
        this.targetProgress = Math.max(0, Math.min(1, progress));

        // 如果手动设置进度，取消自动模拟
        this.unscheduleAllCallbacks();
        this.simulateNetworkFluctuation = false;
        this.stuckAt95Percent = false;

        // 如果进度达到1，触发完成
        if (progress >= 1 && this.isLoading) {
            this.scheduleOnce(() => {
                this.onLoadComplete();
            }, 0.3);
        }
    }

    /**
     * 跳过加载动画直接完成
     */
    skipToComplete(): void {
        this.unscheduleAllCallbacks();
        this.onLoadComplete();
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}