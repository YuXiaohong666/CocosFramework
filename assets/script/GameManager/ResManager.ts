import { CFTools } from "../Tools/CFTools";
import { Tools } from "../Tools/Tools";

export class ResManager {
    /**
     * 加载游戏场景 
     * @param sceneName 加载场景的名字
     * @param callFunc 加载回调
     */
    public static loadScene(sceneName: string, callFunc: any, isClear = true) {
        if (isClear) {
            Tools.clearResDic();
        }
        cc.director.preloadScene(sceneName, () => {
            cc.director.loadScene(sceneName, callFunc);
        });
    };
    /**
     *  加载resource 下的预制体 资源
     * @param url resource 下的资源路径
     * @param callBack 加载完成回调
     */
    public static loadResPrefab(url: string, callBack?: any, parent?: cc.Node, Pos?: cc.Vec2, zIndex = 0) {
        this.loadResAny(url, cc.Prefab, (prefab: cc.Prefab) => {
            let clone = cc.instantiate(prefab);
            if (parent) { parent.addChild(clone, zIndex) };
            if (Pos) { clone.position = cc.v3(Pos.x, Pos.y, 0) };
            if (callBack != null) {
                callBack(clone);
            }
        })
    }
    /**
     * 加载resource 下的图片资源并渲染到节点上
     * @param url resource 下的资源路径
     * @param callBack 加载完成回调
     */
    public static loadResSpriteFrame(url: string, sprite: cc.Node, parent?: cc.Node, Pos?: cc.Vec2, zIndex = 0, callBack?: any) {
        cc.resources.load(url, cc.SpriteFrame, function (error: any, SpriteFrame: cc.SpriteFrame) {
            if (error) {
                CFTools.error(error);
            } else {
                sprite.getComponent(cc.Sprite).spriteFrame = SpriteFrame;
                if (parent) { parent.addChild(sprite, zIndex) };
                if (Pos) { sprite.position = cc.v3(Pos.x, Pos.y, 0) };
                if (callBack != null) {
                    callBack(sprite);
                }
            }
        });
    };
    /**
     * 加载resource 下的游戏资源
     * @param url resource 下的资源路径
     * @param resType 加载资源的类型
     * @param callBack 加载完成回调
     */
    public static loadResAny(url: string, resType: any, callBack?: any) {
        cc.resources.load(url, resType, function (error: any, res: any) {
            if (error) {
                CFTools.error(error);
            } else {
                if (callBack != null) {
                    callBack(res);
                }
            }
        });
    };
    /** 加载bundle 场景 */
    public static loadBundleScene(bundleName: string, sceneName: string, onFinishBack?: () => void, isInScene: boolean = true) {
        cc.assetManager.loadBundle(
            bundleName,
            (err, bundle) => {
                if (err) {
                    CFTools.log(err);
                }
                else {
                    if (!isInScene) { return; }
                    bundle.loadScene(sceneName, (err, scene) => {
                        if (onFinishBack) {
                            onFinishBack();
                        }
                        cc.director.runScene(scene);
                    });
                }
            }
        );
    }
}
