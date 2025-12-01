import Singleton from "../Base/Singleton";
import ResManager from "./ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends Singleton {
    bgMusic: any;  //背景音乐
    isPlayEffect: boolean = true; //是否播放音效
    isPlayMusic: boolean = true; //是否播放音乐

    /**
     * 播放背景音乐
     * @param audioUrl 音乐文件名
     * @param value 音量
     */
    playMusic(audioUrl: string, value = 0.5) {
        if (!this.isPlayMusic) { return; }
        this.stopMusic();
        ResManager._ins.loadResAny(cc.url.raw('resources/music/' + audioUrl + '.mp3'), cc.AudioClip, (audio: cc.AudioClip) => {
            this.bgMusic = cc.audioEngine.play(audio, true, value);
        });
    };
    /** 停止播放背景音乐 */
    stopMusic() {
        this.stopAudio(this.bgMusic);
    };
    /**
     * 播放游戏音效
     * @param audioUrl 音效文件的res/music/的路径
     * @param value 音量大小
     * @param isLoop 是否循环播放
     */
    playEffect(audioUrl: string, value = 0.5, isLoop = false) {
        if (!this.isPlayEffect) { return; }
        ResManager._ins.loadResAny(cc.url.raw('resources/music/' + audioUrl + '.mp3'), cc.AudioClip, (audio: cc.AudioClip) => {
            cc.audioEngine.play(audio, true, value);
        });
    };
    /** 停止播放某个音效 */
    stopAudio(audioE: any) {
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
    playAudioSource(audioUrl: string, value = 0.5, isLoop = false) {
        if (!this.isPlayMusic) { return; }
        ResManager._ins.loadResAny(audioUrl, cc.AudioClip, (audioE: cc.AudioClip) => {
            this.newAudioSource(audioE, value, isLoop);
        });
    }
    /**
     * 新建音效
     * @param audioClip 音效
     * @param value 音量
     * @param isLoop 是否循环
     */
    newAudioSource(audioClip: cc.AudioClip, value = 0.5, isLoop = false) {
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
