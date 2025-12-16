import Singleton from "../Base/Singleton";
import { GameData } from "../GameData/GameData";
import { ResManager } from "./ResManager";
export class AudioManager extends Singleton {
    public bgMusic: any;  //背景音乐
    isPlayEffect: boolean = true; //是否播放音效
    isPlayMusic: boolean = true; //是否播放音乐


    /**
     * 播放背景音乐
     * @param audioUrl 音乐文件名
     * @param value 音量
     */
    public async playMusic(audioUrl: string, value = 1) {
        if (!GameData.getInstance().musicSwitcher) return;
        if (!this.isPlayMusic) { return; }
        this.stopMusic();
        const audioClip = await new Promise<cc.AudioClip>((resolve, reject) => {
            cc.resources.load(`music/${audioUrl}`, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err);
                    reject(err);
                    return;
                }
                resolve(clip);
            });
        });

        // 播放音频
        this.bgMusic = cc.audioEngine.play(audioClip, true, value);
    };
    /** 停止播放背景音乐 */
    public stopMusic() {
        this.stopAudio(this.bgMusic);
    };
    /**
     * 播放游戏音效
     * @param audioUrl 音效文件的res/music/的路径
     * @param value 音量大小
     * @param isLoop 是否循环播放
     */
    public async playEffect(audioUrl: string, value = 0.5, isLoop = false) {
        if (!GameData.getInstance().musicSwitcher) return;
        if (!this.isPlayEffect) { return; }

        const audioClip = await new Promise<cc.AudioClip>((resolve, reject) => {
            cc.resources.load(`music/${audioUrl}`, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err);
                    reject(err);
                    return;
                }
                resolve(clip);
            });
        });

        // 播放音效
        cc.audioEngine.play(audioClip, isLoop, value);
    };
    /** 停止播放某个音效 */
    public stopAudio(audioE: any) {
        if (audioE != null) {
            cc.audioEngine.stop(audioE);
            audioE = null;
        }
    }
    /**
     * 新建一个audioSource 来播放音效
     * @param audioUrl 音效文件的res/music/的路径 或者 resArr拖动的名字
     * @param value 音量大小
     * @param isLoop 是否循环播放
     */
    public playAudioSource(audioUrl: string, value = 0.5, isLoop = false) {
        if (!this.isPlayMusic) { return; }
        ResManager.loadResAny(audioUrl, cc.AudioClip, (audioE: cc.AudioClip) => {
            this.newAudioSource(audioE, value, isLoop);
        });
    }
    /**
     * 新建音效
     * @param audioClip 音效
     * @param value 音量
     * @param isLoop 是否循环
     */
    public newAudioSource(audioClip: cc.AudioClip, value = 0.5, isLoop = false) {
        let node = new cc.Node();
        let audioE = node.addComponent(cc.AudioSource);
        audioE.clip = audioClip;
        audioE.loop = isLoop;
        audioE.volume = value;

        audioE.play();
        if (isLoop == false) {
            cc.tween(node).delay(audioE.getDuration() + 0.1)
                .removeSelf().union().start();
        }
        return audioE;
    };

}
